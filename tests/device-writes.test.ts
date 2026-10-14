import { afterAll, beforeEach, describe, expect, mock, spyOn, test } from 'bun:test';
import { defineEventHandler } from 'h3';
import type { H3Event, MultiPartData } from 'h3';
import mongoose from 'mongoose';
import { cleanupDeviceImage } from '../server/utils/deviceImageCleanup';
import { parseDeviceForm, throwDeviceWriteError } from '../server/utils/deviceValidation';

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
const uploadImage = mock(async () => ({ url: newImage }));
const removeImage = mock(async (_url: string, _options: { abortSignal: AbortSignal }) => {
  if (cleanupFails || transientFailures-- > 0) throw new Error('Blob unavailable');
});
const cleanup = mock((url?: string) => cleanupDeviceImage(url, removeImage));
const logError = spyOn(console, 'error').mockImplementation(() => {});

// Supply Nuxt aliases and auto-imports while exercising the real route handlers.
const runtime = globalThis as typeof globalThis & { defineEventHandler: typeof defineEventHandler };
const originalHandler = runtime.defineEventHandler;
runtime.defineEventHandler = defineEventHandler;
mock.module('~~/server/utils/auth', () => ({ requireAdmin: async () => {} }));
mock.module('~~/server/models/device.schema', () => ({ DeviceSchema: { create: createRecord } }));
mock.module('~~/server/utils/deviceMultipart', () => ({ readDeviceMultipart: async () => form }));
mock.module('~~/server/utils/deviceValidation', () => ({ parseDeviceForm, throwDeviceWriteError }));
mock.module('~~/server/utils/deviceImageCleanup', () => ({ cleanupDeviceImage: cleanup }));
mock.module('~~/server/utils/devices', () => ({
  findDeviceOrThrow: async () => device,
  uploadDeviceImage: uploadImage
}));
const { default: createDevice } = await import('../server/api/devices/index.post');
const { default: updateDevice } = await import('../server/api/devices/[id].put');
const { default: deleteDevice } = await import('../server/api/devices/[id].delete');

function event() {
  return { context: { params: { id: 'test' } } } as unknown as H3Event;
}

beforeEach(() => {
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
  for (const fn of [createRecord, saveRecord, deleteRecord, uploadImage, removeImage, cleanup, logError]) fn.mockClear();
});

afterAll(() => {
  runtime.defineEventHandler = originalHandler;
  logError.mockRestore();
  mock.restore();
});

describe('device write image lifecycle', () => {
  test('keeps the uploaded image after successful creation', async () => {
    expect(await createDevice(event())).toMatchObject({ _id: 'created-id', img: newImage });
    expect(cleanup).not.toHaveBeenCalled();
  });

  test('removes an uploaded image when creation fails with a duplicate key', async () => {
    createFailure = { code: 11000 };
    await expect(createDevice(event())).rejects.toMatchObject({ statusCode: 409 });
    expect(removeImage.mock.calls.map(([url]) => url)).toEqual([newImage]);
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
    expect(removeImage.mock.calls.map(([url]) => url)).toEqual([newImage]);
  });

  test('removes the previous image after a successful replacement', async () => {
    expect(await updateDevice(event())).toMatchObject({ img: newImage });
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
    expect(removeImage).toHaveBeenCalledTimes(3);
    expect(logError).toHaveBeenCalledTimes(1);
  });

  test('retries transient cleanup failures until deletion succeeds', async () => {
    transientFailures = 2;
    expect(await deleteDevice(event())).toEqual({ deleted: true, id: 'test' });
    expect(removeImage).toHaveBeenCalledTimes(3);
    expect(logError).not.toHaveBeenCalled();
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
