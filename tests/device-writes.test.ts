import { afterAll, beforeEach, describe, expect, mock, spyOn, test } from 'bun:test';
import { createHmac } from 'node:crypto';
import { createApp, defineEventHandler, getMethod, getRequestURL, toWebHandler } from 'h3';
import type { H3Event, MultiPartData } from 'h3';
import mongoose from 'mongoose';
import { cleanupDeviceImage } from '../server/utils/deviceImageCleanup';
import { parseDeviceForm, throwDeviceWriteError } from '../server/utils/deviceValidation';
import { requireAdmin, clearAdminSession } from '../server/utils/auth';
import csrf from '../server/middleware/csrf';

const authenticate = requireAdmin;
const clearSession = clearAdminSession;
const trustedOrigin = 'https://www.mindtheheadphone.com.br';
const sessionSecret = 'csrf-test-session-secret';
const environmentKeys = ['NUXT_SESSION_PASSWORD', 'ADMIN_EMAILS', 'NUXT_APP_ORIGIN'] as const;
const originalEnvironment = Object.fromEntries(environmentKeys.map(key => [key, process.env[key]]));

function sessionCookie() {
  const payload = Buffer.from(JSON.stringify({
    user: { email: 'admin@example.com' }, exp: Math.floor(Date.now() / 1000) + 60
  })).toString('base64url');
  const signature = createHmac('sha256', sessionSecret).update(payload).digest('base64url');
  return `mth_admin_session=${payload}.${signature}`;
}

const oldImage = 'https://example.com/old.webp';
const newImage = 'https://example.com/new.webp';
let form: MultiPartData[];
let createFailure: unknown;
let saveFailure: unknown;
let cleanupFails: boolean;
let transientFailures: number;

function field(name: string, value: string, type?: string): MultiPartData {
  return { name, data: Buffer.from(value), type };
}

const createRecord = mock(async (data: Record<string, unknown>) => {
  if (createFailure) throw createFailure;
  return { ...data, _id: 'created-id' };
});
const saveRecord = mock(async () => {
  if (saveFailure) throw saveFailure;
  return device;
});
const deleteRecord = mock(async () => {});
function makeDevice() {
  return {
    name: 'Test', slug: 'test', type: 'Earphone' as const, category: 'Earbud',
    signature: 'Natural' as const, imported: false, price: 100, overview: 'Description',
    tags: ['Stored'], img: oldImage,
    set(key: string | Record<string, unknown>, value?: unknown) {
      if (typeof key === 'string') Reflect.set(this, key, value);
      else Object.assign(this, key);
    },
    save: saveRecord,
    deleteOne: deleteRecord
  };
}
let device = makeDevice();
const readMultipart = mock(async () => form);
const findDevice = mock(async () => device);
const uploadImage = mock(async () => ({ url: newImage }));
const removeImage = mock(async (_url: string, _options: { abortSignal: AbortSignal }) => {
  if (cleanupFails || transientFailures-- > 0) throw new Error('Blob unavailable');
});
const cleanup = mock((url?: string) => cleanupDeviceImage(url, removeImage));
const revalidate = mock(async () => {});
const logError = spyOn(console, 'error').mockImplementation(() => {});

// Supply Nuxt aliases and auto-imports while exercising the real route handlers.
const runtime = globalThis as typeof globalThis & { defineEventHandler: typeof defineEventHandler };
const originalHandler = runtime.defineEventHandler;
runtime.defineEventHandler = defineEventHandler;
mock.module('~~/server/utils/auth', () => ({ requireAdmin: async () => {}, clearAdminSession: clearSession }));
mock.module('~~/server/models/device.schema', () => ({ DeviceSchema: { create: createRecord } }));
mock.module('~~/server/utils/deviceMultipart', () => ({ readDeviceMultipart: readMultipart }));
mock.module('~~/server/utils/deviceValidation', () => ({ parseDeviceForm, throwDeviceWriteError }));
mock.module('~~/server/utils/deviceImageCleanup', () => ({ cleanupDeviceImage: cleanup }));
mock.module('~~/server/utils/revalidateRecommendations', () => ({ revalidateRecommendations: revalidate }));
mock.module('~~/server/utils/devices', () => ({
  findDeviceOrThrow: findDevice,
  uploadDeviceImage: uploadImage
}));
const { default: createDevice } = await import('../server/api/devices/index.post');
const { default: updateDevice } = await import('../server/api/devices/[id].put');
const { default: deleteDevice } = await import('../server/api/devices/[id].delete');
const { default: logout } = await import('../server/api/auth/logout.post');

// Mount the real CSRF and authentication checks ahead of the real mutation handlers.
// Database, multipart parsing, and Blob calls remain controlled test substitutes.
const handleWrite = toWebHandler(createApp().use(csrf).use(defineEventHandler(async (event) => {
  if (getRequestURL(event).pathname === '/api/auth/logout') return logout(event);
  await authenticate(event);
  event.context.params = { id: 'test' };
  switch (getMethod(event)) {
    case 'POST': return createDevice(event);
    case 'PUT': return updateDevice(event);
    case 'DELETE': return deleteDevice(event);
  }
})));

function writeRequest(method: string, path: string, headers: Record<string, string> = {}) {
  return handleWrite(new Request(`${trustedOrigin}${path}`, {
    method, headers: { cookie: sessionCookie(), ...headers }
  }));
}

function event() {
  return { context: { params: { id: 'test' } } } as unknown as H3Event;
}

beforeEach(() => {
  process.env.NUXT_SESSION_PASSWORD = sessionSecret;
  process.env.ADMIN_EMAILS = 'admin@example.com';
  process.env.NUXT_APP_ORIGIN = trustedOrigin;
  createFailure = undefined;
  saveFailure = undefined;
  cleanupFails = false;
  transientFailures = 0;
  device = makeDevice();
  form = [
    field('name', 'Test'), field('type', 'Earphone'), field('category', 'Earbud'),
    field('signature', 'Natural'), field('price', '100'), field('imported', '0'),
    field('overview', 'Description'), field('image', 'placeholder', 'image/png')
  ];
  for (const fn of [createRecord, saveRecord, deleteRecord, readMultipart, findDevice, uploadImage, removeImage, cleanup, revalidate, logError]) fn.mockClear();
});

afterAll(() => {
  runtime.defineEventHandler = originalHandler;
  logError.mockRestore();
  mock.restore();
  for (const key of environmentKeys) {
    const value = originalEnvironment[key];
    if (value === undefined) Reflect.deleteProperty(process.env, key);
    else process.env[key] = value;
  }
});

describe('CSRF enforcement before device writes and logout', () => {
  test('blocks every mutation and logout with a valid admin cookie from other origins', async () => {
    for (const [method, path] of [
      ['POST', '/api/devices'], ['PUT', '/api/devices/test'],
      ['DELETE', '/api/devices/test'], ['POST', '/api/auth/logout']
    ] as const) {
      for (const origin of ['https://attacker.example', 'https://old.mindtheheadphone.com.br']) {
        const response = await writeRequest(method, path, { origin });
        expect(response.status).toBe(403);
        expect(response.headers.get('set-cookie')).toBeNull();
      }
    }
    for (const fn of [readMultipart, findDevice, createRecord, saveRecord, deleteRecord, uploadImage, removeImage, revalidate]) {
      expect(fn).not.toHaveBeenCalled();
    }
  });

  test('preserves authenticated same-origin CRUD and logout', async () => {
    expect((await writeRequest('POST', '/api/devices', { origin: trustedOrigin })).status).toBe(200);
    expect((await writeRequest('PUT', '/api/devices/test', { origin: trustedOrigin })).status).toBe(200);
    expect((await writeRequest('DELETE', '/api/devices/test', { origin: trustedOrigin })).status).toBe(200);
    expect(createRecord).toHaveBeenCalledTimes(1);
    expect(saveRecord).toHaveBeenCalledTimes(1);
    expect(deleteRecord).toHaveBeenCalledTimes(1);
    const response = await writeRequest('POST', '/api/auth/logout', { origin: trustedOrigin });
    expect(response.status).toBe(200);
    expect(response.headers.get('set-cookie')).toContain('mth_admin_session=;');
    expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
  });

  test('keeps authentication and authorization checks after a valid origin check', async () => {
    expect((await writeRequest('POST', '/api/devices', { origin: trustedOrigin, cookie: '' })).status).toBe(401);
    process.env.ADMIN_EMAILS = 'another@example.com';
    expect((await writeRequest('POST', '/api/devices', { origin: trustedOrigin })).status).toBe(403);
    expect(createRecord).not.toHaveBeenCalled();
    expect(uploadImage).not.toHaveBeenCalled();
  });
});

describe('device write image lifecycle', () => {
  test('keeps the uploaded image after successful creation', async () => {
    expect(await createDevice(event())).toMatchObject({ _id: 'created-id', img: newImage });
    expect(cleanup).not.toHaveBeenCalled();
    expect(revalidate).toHaveBeenCalledTimes(1);
  });

  test('removes an uploaded image when creation fails with a duplicate key', async () => {
    createFailure = { code: 11000 };
    await expect(createDevice(event())).rejects.toMatchObject({ statusCode: 409 });
    expect(removeImage.mock.calls.map(([url]) => url)).toEqual([newImage]);
    expect(revalidate).not.toHaveBeenCalled();
  });

  test('preserves the database error if rollback cleanup also fails', async () => {
    createFailure = { code: 11000 };
    cleanupFails = true;
    await expect(createDevice(event())).rejects.toMatchObject({ statusCode: 409 });
    expect(removeImage).toHaveBeenCalledTimes(3);
    expect(logError).toHaveBeenCalledWith(expect.any(String), { url: newImage, error: expect.any(Error) });
  });

  test('rolls back a failed replacement without deleting the stored image', async () => {
    saveFailure = new mongoose.Error.ValidationError();
    await expect(updateDevice(event())).rejects.toMatchObject({ statusCode: 400 });
    expect(revalidate).not.toHaveBeenCalled();
    expect(removeImage.mock.calls.map(([url]) => url)).toEqual([newImage]);
  });

  test('removes the previous image after a successful replacement', async () => {
    expect(await updateDevice(event())).toMatchObject({ img: newImage });
    expect(revalidate).toHaveBeenCalledTimes(1);
    expect(removeImage.mock.calls.map(([url]) => url)).toEqual([oldImage]);
  });

  test('returns a committed replacement even if cleanup exhausts its retries', async () => {
    cleanupFails = true;
    expect(await updateDevice(event())).toMatchObject({ img: newImage });
    expect(saveRecord).toHaveBeenCalledTimes(1);
    expect(removeImage.mock.calls.map(([url]) => url)).toEqual([oldImage, oldImage, oldImage]);
    expect(logError).toHaveBeenCalledTimes(1);
  });

  test('returns a committed deletion even if image cleanup fails', async () => {
    cleanupFails = true;
    expect(await deleteDevice(event())).toEqual({ deleted: true, id: 'test' });
    expect(deleteRecord).toHaveBeenCalledTimes(1);
    expect(revalidate).toHaveBeenCalledTimes(1);
    expect(removeImage).toHaveBeenCalledTimes(3);
    expect(logError).toHaveBeenCalledTimes(1);
  });

  test('retries transient cleanup failures until deletion succeeds', async () => {
    transientFailures = 2;
    expect(await deleteDevice(event())).toEqual({ deleted: true, id: 'test' });
    expect(removeImage).toHaveBeenCalledTimes(3);
    expect(logError).not.toHaveBeenCalled();
  });

  test('does not revalidate when deletion fails', async () => {
    deleteRecord.mockImplementationOnce(async () => {
      throw new Error('Database unavailable');
    });
    await expect(deleteDevice(event())).rejects.toThrow('Database unavailable');
    expect(revalidate).not.toHaveBeenCalled();
    expect(cleanup).not.toHaveBeenCalled();
  });

  test('persists an explicitly cleared tag list without replacing the image', async () => {
    form = [field('tags', '[]')];
    expect(await updateDevice(event())).toMatchObject({ tags: [], img: oldImage });
    expect(uploadImage).not.toHaveBeenCalled();
    expect(removeImage).not.toHaveBeenCalled();
  });

  test('does not remove an existing image when an update without an upload fails', async () => {
    form = [field('price', '250')];
    saveFailure = new Error('Database unavailable');
    await expect(updateDevice(event())).rejects.toBe(saveFailure);
    expect(removeImage).not.toHaveBeenCalled();
  });

  test('bounds cleanup calls that never settle and aborts each attempt', async () => {
    const signals: AbortSignal[] = [];
    await cleanupDeviceImage(newImage, (_url, options) => {
      signals.push(options.abortSignal);
      return new Promise<void>(() => {});
    });
    expect(signals).toHaveLength(3);
    expect(signals.every(signal => signal.aborted)).toBe(true);
    expect(logError).toHaveBeenCalledTimes(1);
  }, 10_000);
});
