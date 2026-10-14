export const DEVICE_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAX_DEVICE_IMAGE_BYTES = 3 * 1024 * 1024;
export const MAX_DEVICE_UPLOAD_BYTES = MAX_DEVICE_IMAGE_BYTES + 64 * 1024;
export const MAX_DEVICE_IMAGE_PIXELS = 20_000_000;
export const MAX_DEVICE_IMAGE_SIDE = 8_000;
export const DEVICE_IMAGE_OUTPUT_SIDE = 1_200;
export const MAX_DEVICE_IMAGE_OUTPUT_BYTES = 1024 * 1024;
