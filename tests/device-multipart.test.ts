import { describe, expect, test } from 'bun:test';
import { Readable } from 'node:stream';
import { createServer } from 'node:http';
import { createApp, createEvent, defineEventHandler, toNodeListener } from 'h3';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { readDeviceMultipart } from '../server/utils/deviceMultipart';
import { MAX_DEVICE_UPLOAD_BYTES } from '../shared/utils/deviceImage';

function event(source: Readable, headers: Record<string, string> = {}, method = 'POST') {
  Object.assign(source, { headers, method, url: '/api/devices' });
  return createEvent(source as IncomingMessage, {} as ServerResponse);
}

async function multipart() {
  const form = new FormData();
  form.append('name', 'Valid name');
  form.append('tags[0]', 'One');
  form.append('tags[0]', 'Duplicate');
  form.append('image', new Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' }), 'example.png');
  const response = new Request('http://localhost/api/devices', { method: 'POST', body: form });
  const type = response.headers.get('content-type')!;
  return { data: Buffer.from(await response.arrayBuffer()), type };
}

describe('bounded device multipart reads', () => {
  test('returns HTTP 413 for a chunked oversized upload without resetting the socket', async () => {
    const app = createApp().use(defineEventHandler(async (event) => {
      await readDeviceMultipart(event);
      return { accepted: true };
    }));
    const server = createServer(toNodeListener(app));
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    try {
      const address = server.address();
      if (!address || typeof address === 'string') throw new Error('Server did not bind');
      const response = await fetch(`http://127.0.0.1:${address.port}/api/devices`, {
        method: 'POST',
        headers: { 'content-type': 'multipart/form-data; boundary=x' },
        body: new ReadableStream({
          start(controller) {
            controller.enqueue(new Uint8Array(MAX_DEVICE_UPLOAD_BYTES));
            controller.enqueue(new Uint8Array(1));
            controller.close();
          }
        })
      });
      expect(response.status).toBe(413);
      expect((await response.json()).statusCode).toBe(413);
    } finally {
      server.closeAllConnections();
      await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    }
  });

  test('supports streamed creation/replacement forms and retains duplicate fields for validation', async () => {
    const { data, type } = await multipart();
    for (const method of ['POST', 'PUT']) {
      const parts = await readDeviceMultipart(event(Readable.from([data]), { 'content-type': type }, method));
      expect(parts.map(part => part.name)).toEqual(['name', 'tags[0]', 'tags[0]', 'image']);
      expect(parts[3]).toMatchObject({ type: 'image/png', filename: 'example.png' });
      expect(parts[3]!.data).toEqual(Buffer.from([1, 2, 3]));
    }
  });

  test('rejects oversized Content-Length without reading any chunks', async () => {
    let read = false;
    const source = Readable.from((async function* () {
      read = true;
      yield Buffer.alloc(1);
    })());
    await expect(readDeviceMultipart(event(source, {
      'content-type': 'multipart/form-data; boundary=x', 'content-length': String(MAX_DEVICE_UPLOAD_BYTES + 1)
    }))).rejects.toMatchObject({ statusCode: 413 });
    expect(read).toBe(false);
  });

  test('enforces actual bytes with absent or misleading Content-Length', async () => {
    for (const length of [undefined, '1']) {
      const headers: Record<string, string> = { 'content-type': 'multipart/form-data; boundary=x' };
      if (length) headers['content-length'] = length;
      const source = Readable.from([Buffer.alloc(MAX_DEVICE_UPLOAD_BYTES), Buffer.alloc(1)]);
      await expect(readDeviceMultipart(event(source, headers))).rejects.toMatchObject({ statusCode: 413 });
    }
  });

  test('bounds Web streams and prebuffered bodies as well as Node streams', async () => {
    const { data, type } = await multipart();
    const valid = event(Readable.from([]), { 'content-type': type });
    valid._requestBody = data;
    expect(await readDeviceMultipart(valid)).toHaveLength(4);
    const arrayBuffer = event(Readable.from([]), { 'content-type': type });
    arrayBuffer._requestBody = Uint8Array.from(data).buffer;
    expect(await readDeviceMultipart(arrayBuffer)).toHaveLength(4);
    const oversizedArrayBuffer = event(Readable.from([]), { 'content-type': type });
    oversizedArrayBuffer._requestBody = new ArrayBuffer(MAX_DEVICE_UPLOAD_BYTES + 1);
    await expect(readDeviceMultipart(oversizedArrayBuffer)).rejects.toMatchObject({ statusCode: 413 });
    const tooBig = event(Readable.from([]), { 'content-type': type });
    tooBig._requestBody = Buffer.alloc(MAX_DEVICE_UPLOAD_BYTES + 1);
    await expect(readDeviceMultipart(tooBig)).rejects.toMatchObject({ statusCode: 413 });
    const web = event(Readable.from([]), { 'content-type': type });
    let cancelled = false;
    web._requestBody = new ReadableStream({
      start(controller) { controller.enqueue(new Uint8Array(MAX_DEVICE_UPLOAD_BYTES + 1)); },
      cancel() { cancelled = true; }
    });
    await expect(readDeviceMultipart(web)).rejects.toMatchObject({ statusCode: 413 });
    expect(cancelled).toBe(true);
  });

  test('handles cached platform bodies and valid Web requests without bypassing the limit', async () => {
    const { data, type } = await multipart();
    for (const key of ['rawBody', 'body', Symbol.for('h3RawBody')]) {
      const valid = event(Readable.from([]), { 'content-type': type });
      Object.defineProperty(valid.node.req, key, { value: data });
      expect(await readDeviceMultipart(valid)).toHaveLength(4);
      const oversized = event(Readable.from([]), { 'content-type': type });
      Object.defineProperty(oversized.node.req, key, { value: Promise.resolve(Buffer.alloc(MAX_DEVICE_UPLOAD_BYTES + 1)) });
      await expect(readDeviceMultipart(oversized)).rejects.toMatchObject({ statusCode: 413 });
    }
    const web = event(Readable.from([]), { 'content-type': type });
    web.web = { request: new Request('http://localhost/api/devices', { method: 'POST', body: data }) };
    expect(await readDeviceMultipart(web)).toHaveLength(4);
  });

  test('accepts quoted boundaries, rejects file-valued scalar fields, and caps field count', async () => {
    const { data, type } = await multipart();
    const quotedType = type.replace(/boundary=(.*)$/, 'boundary="$1"');
    expect(await readDeviceMultipart(event(Readable.from([data]), { 'content-type': quotedType }))).toHaveLength(4);
    for (const makeForm of [
      () => {
        const form = new FormData();
        form.append('name', new Blob(['file contents']), 'name.txt');
        return form;
      },
      () => {
        const form = new FormData();
        for (let i = 0; i < 33; i++) form.append('name', 'x');
        return form;
      }
    ]) {
      const request = new Request('http://localhost/api/devices', { method: 'POST', body: makeForm() });
      const contentType = request.headers.get('content-type')!;
      const body = Buffer.from(await request.arrayBuffer());
      await expect(readDeviceMultipart(event(Readable.from([body]), { 'content-type': contentType }))).rejects.toMatchObject({ statusCode: 400 });
    }
  });

  test('rejects malformed multipart, invalid length, and text-valued image fields', async () => {
    await expect(readDeviceMultipart(event(Readable.from([]), { 'content-type': 'text/plain' }))).rejects.toMatchObject({ statusCode: 400 });
    await expect(readDeviceMultipart(event(Readable.from([Buffer.from('invalid')]), { 'content-type': 'multipart/form-data; boundary=x' }))).rejects.toMatchObject({ statusCode: 400 });
    await expect(readDeviceMultipart(event(Readable.from([]), { 'content-length': 'NaN' }))).rejects.toMatchObject({ statusCode: 400 });
    const form = new FormData();
    form.append('image', 'Not a file');
    const response = new Request('http://localhost/api/devices', { method: 'POST', body: form });
    const type = response.headers.get('content-type')!;
    await expect(readDeviceMultipart(event(Readable.from([Buffer.from(await response.arrayBuffer())]), {
      'content-type': type
    }))).rejects.toMatchObject({ statusCode: 400 });
  });
});
