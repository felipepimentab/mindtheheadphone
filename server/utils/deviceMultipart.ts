import { Readable } from 'node:stream';
import { createError, getRequestHeader } from 'h3';
import type { H3Event, MultiPartData } from 'h3';
import { MAX_DEVICE_UPLOAD_BYTES } from '../../shared/utils/deviceImage';

function tooLarge(): never {
  throw createError({ statusCode: 413, statusMessage: 'Device upload exceeds the request size limit' });
}

/** Bound every supported body source before buffering or parsing multipart. */
export async function readDeviceMultipart(event: H3Event): Promise<MultiPartData[]> {
  const length = getRequestHeader(event, 'content-length');
  if (length !== undefined) {
    if (!/^\d+$/.test(length)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid content length' });
    }
    if (Number(length) > MAX_DEVICE_UPLOAD_BYTES) tooLarge();
  }

  const contentType = getRequestHeader(event, 'content-type') || '';
  if (!/^multipart\/form-data\s*;/i.test(contentType)) {
    throw createError({ statusCode: 400, statusMessage: 'Multipart form data is required' });
  }

  const req = event.node.req as typeof event.node.req & {
    rawBody?: unknown
    body?: unknown
    [key: symbol]: unknown
  };
  const source: unknown = await (event._requestBody ?? event.web?.request?.body
    ?? req[Symbol.for('h3RawBody')] ?? req.rawBody ?? req.body ?? req);
  const chunks: Buffer[] = [];
  let bytes = 0;
  const append = (chunk: Uint8Array | string) => {
    const size = typeof chunk === 'string' ? Buffer.byteLength(chunk) : chunk.byteLength;
    bytes += size;
    if (bytes > MAX_DEVICE_UPLOAD_BYTES) tooLarge();
    chunks.push(Buffer.from(chunk));
  };

  if (typeof source === 'string' || source instanceof Uint8Array) {
    append(source);
  } else if (source instanceof ArrayBuffer || ArrayBuffer.isView(source)) {
    if (source.byteLength > MAX_DEVICE_UPLOAD_BYTES) tooLarge();
    append(source instanceof ArrayBuffer
      ? new Uint8Array(source)
      : new Uint8Array(source.buffer, source.byteOffset, source.byteLength));
  } else if (source instanceof ReadableStream) {
    const reader = source.getReader();
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        append(value);
      }
    } catch (error) {
      await reader.cancel().catch(() => {});
      throw error;
    } finally {
      reader.releaseLock();
    }
  } else if (source instanceof Readable) {
    try {
      for await (const chunk of source.iterator({ destroyOnReturn: false })) append(chunk);
    } catch (error) {
      source.pause();
      throw error;
    }
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported request body' });
  }

  let form: FormData;
  try {
    form = await new Response(Buffer.concat(chunks), {
      headers: { 'content-type': contentType }
    }).formData();
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Malformed multipart form data' });
  }

  const parts: MultiPartData[] = [];
  for (const [name, value] of form.entries()) {
    if (parts.length >= 32 || (name === 'image') !== (typeof value !== 'string')) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid multipart fields' });
    }
    parts.push(typeof value === 'string'
      ? { name, data: Buffer.from(value) }
      : { name, filename: value.name, type: value.type, data: Buffer.from(await value.arrayBuffer()) });
  }
  if (!parts.length) {
    throw createError({ statusCode: 400, statusMessage: 'Multipart form data is required' });
  }
  return parts;
}
