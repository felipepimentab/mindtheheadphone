import { put } from '@vercel/blob';
import { createHash } from 'node:crypto';
import { createError } from 'h3';
import { DeviceSchema } from '~~/server/models/device.schema';
import { useCreateDevice } from '~/composables/useCreateDevice';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function withContentHash(path: string, content: Uint8Array) {
  const contentHash = createHash('sha256').update(content).digest('hex').slice(0, 16);
  const extensionIndex = path.lastIndexOf('.');

  if (extensionIndex === -1) {
    return `${path}.${contentHash}`;
  }

  const filename = path.slice(0, extensionIndex);
  const extension = path.slice(extensionIndex);

  return `${filename}.${contentHash}${extension}`;
}

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  if (!form) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing multipart form data'
    });
  }

  try {
    const { deviceData, imagePath, imageData } = useCreateDevice(form);

    const imagePathWithHash = withContentHash(imagePath, imageData);
    const { url } = await put(imagePathWithHash, imageData, {
      access: 'public',
      allowOverwrite: true,
      cacheControlMaxAge: ONE_YEAR_SECONDS
    });

    const newDevice = new DeviceSchema({
      ...deviceData,
      img: url
    });

    const savedDevice = await newDevice.save();

    return {
      id: savedDevice._id,
      img: savedDevice.img
    };
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === 'File is not an image') {
      throw createError({
        statusCode: 400,
        statusMessage: error.message
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create device'
    });
  }
});
