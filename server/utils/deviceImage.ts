import sharp from 'sharp';
import { createError, isError } from 'h3';
import type { MultiPartData } from 'h3';
import {
  DEVICE_IMAGE_MIME_TYPES, DEVICE_IMAGE_OUTPUT_SIDE, MAX_DEVICE_IMAGE_BYTES,
  MAX_DEVICE_IMAGE_OUTPUT_BYTES, MAX_DEVICE_IMAGE_PIXELS, MAX_DEVICE_IMAGE_SIDE
} from '../../shared/utils/deviceImage';

function detectedFormat(data: Buffer): string | undefined {
  if (data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'png';
  if (data[0] === 255 && data[1] === 216 && data[2] === 255) return 'jpeg';
  if (data.length >= 12 && data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP') return 'webp';
}

/** Fully decode untrusted raster images and publish only normalized bytes. */
export async function normalizeDeviceImage(image: MultiPartData): Promise<Buffer> {
  if (!image.data.length) {
    throw createError({ statusCode: 400, statusMessage: 'Device image is empty' });
  }
  if (image.data.length > MAX_DEVICE_IMAGE_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'Device image exceeds 3 MiB' });
  }
  const format = detectedFormat(image.data);
  if (!format || !DEVICE_IMAGE_MIME_TYPES.some(type => type === image.type) || image.type !== `image/${format}`) {
    throw createError({ statusCode: 415, statusMessage: 'Upload a genuine JPEG, PNG, or WebP image with its matching content type' });
  }

  try {
    const pipeline = sharp(image.data, { limitInputPixels: MAX_DEVICE_IMAGE_PIXELS, failOn: 'warning' });
    const metadata = await pipeline.metadata();
    const { width, height } = metadata;
    if (metadata.format !== format || !width || !height || width > MAX_DEVICE_IMAGE_SIDE
      || height > MAX_DEVICE_IMAGE_SIDE || width * height > MAX_DEVICE_IMAGE_PIXELS
      || (metadata.pages ?? 1) !== 1) {
      throw createError({ statusCode: 400, statusMessage: 'Image dimensions exceed the limits or image is animated' });
    }
    const output = await pipeline.autoOrient()
      .resize({ width: DEVICE_IMAGE_OUTPUT_SIDE, height: DEVICE_IMAGE_OUTPUT_SIDE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .timeout({ seconds: 5 })
      .toBuffer();
    if (output.length > MAX_DEVICE_IMAGE_OUTPUT_BYTES) {
      throw createError({ statusCode: 413, statusMessage: 'Normalized image exceeds 1 MiB; use a smaller image' });
    }
    return output;
  } catch (error) {
    if (isError(error)) throw error;
    throw createError({ statusCode: 400, statusMessage: 'Image is malformed or exceeds processing limits' });
  }
}
