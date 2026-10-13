import { describe, expect, test } from 'bun:test';
import { randomBytes } from 'node:crypto';
import sharp from 'sharp';
import { normalizeDeviceImage } from '../server/utils/deviceImage';
import { MAX_DEVICE_IMAGE_BYTES } from '../shared/utils/deviceImage';

async function fixture(format: 'jpeg' | 'png' | 'webp', width = 32, height = 16) {
  return sharp({ create: { width, height, channels: 4, background: { r: 80, g: 90, b: 100, alpha: 0.5 } } })
    .toFormat(format).toBuffer();
}

function image(data: Buffer, type = 'image/png') {
  return { name: 'image', filename: 'untrusted-name.svg', data, type };
}

describe('device image normalization', () => {
  test('decodes each accepted format, emits WebP, and never enlarges small images', async () => {
    for (const format of ['jpeg', 'png', 'webp'] as const) {
      const output = await normalizeDeviceImage(image(await fixture(format), `image/${format}`));
      const metadata = await sharp(output).metadata();
      expect(metadata).toMatchObject({ format: 'webp', width: 32, height: 16 });
      expect(metadata.exif).toBeUndefined();
      expect(metadata.icc).toBeUndefined();
    }
  });

  test('preserves transparency and fits large images inside the output bounds', async () => {
    const output = await normalizeDeviceImage(image(await fixture('png', 1600, 800)));
    expect(await sharp(output).metadata()).toMatchObject({ width: 1200, height: 600, hasAlpha: true });
  });

  test('applies EXIF orientation before stripping metadata', async () => {
    const input = await sharp(await fixture('jpeg', 40, 20)).withMetadata({ orientation: 6 }).toBuffer();
    const output = await normalizeDeviceImage(image(input, 'image/jpeg'));
    const metadata = await sharp(output).metadata();
    expect(metadata).toMatchObject({ width: 20, height: 40, format: 'webp' });
    expect(metadata.exif).toBeUndefined();
    expect(metadata.icc).toBeUndefined();
  });

  test('rejects empty, unsupported, spoofed, and malformed image bytes', async () => {
    await expect(normalizeDeviceImage(image(Buffer.alloc(0)))).rejects.toMatchObject({ statusCode: 400 });
    await expect(normalizeDeviceImage(image(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>')))).rejects.toMatchObject({ statusCode: 415 });
    await expect(normalizeDeviceImage(image(await fixture('png'), 'image/jpeg'))).rejects.toMatchObject({ statusCode: 415 });
    await expect(normalizeDeviceImage(image(await fixture('png'), 'image/svg+xml'))).rejects.toMatchObject({ statusCode: 415 });
    await expect(normalizeDeviceImage(image(Buffer.from([255, 216, 255, 0]), 'image/jpeg'))).rejects.toMatchObject({ statusCode: 400 });
    const png = await fixture('png');
    await expect(normalizeDeviceImage(image(png.subarray(0, Math.floor(png.length / 2))))).rejects.toMatchObject({ statusCode: 400 });
    const gif = await sharp(await fixture('png')).gif().toBuffer();
    await expect(normalizeDeviceImage(image(gif, 'image/png'))).rejects.toMatchObject({ statusCode: 415 });
  });

  test('rejects files above the byte limit before decoding', async () => {
    await expect(normalizeDeviceImage(image(Buffer.alloc(MAX_DEVICE_IMAGE_BYTES + 1)))).rejects.toMatchObject({ statusCode: 413 });
  });

  test('rejects normalized output above its byte limit', async () => {
    const input = await sharp(randomBytes(900 * 800 * 4), { raw: { width: 900, height: 800, channels: 4 } }).png().toBuffer();
    expect(input.length).toBeLessThan(MAX_DEVICE_IMAGE_BYTES);
    await expect(normalizeDeviceImage(image(input))).rejects.toMatchObject({ statusCode: 413 });
  });

  test('rejects extreme dimensions and pixel counts even in small compressed files', async () => {
    await expect(normalizeDeviceImage(image(await fixture('png', 8001, 1)))).rejects.toMatchObject({ statusCode: 400 });
    const input = await fixture('png', 5000, 4001);
    expect(input.length).toBeLessThan(MAX_DEVICE_IMAGE_BYTES);
    await expect(normalizeDeviceImage(image(input))).rejects.toMatchObject({ statusCode: 400 });
  });

  test('rejects animated WebP instead of silently keeping its first frame', async () => {
    const pixels = Buffer.alloc(4 * 8 * 4, 255);
    pixels.fill(0, 4 * 4 * 4);
    const input = await sharp(pixels, { raw: { width: 4, height: 8, channels: 4, pageHeight: 4 } }).webp({ loop: 0, delay: [100, 100] }).toBuffer();
    expect((await sharp(input, { animated: true }).metadata()).pages).toBe(2);
    await expect(normalizeDeviceImage(image(input, 'image/webp'))).rejects.toMatchObject({ statusCode: 400 });
  });
});
