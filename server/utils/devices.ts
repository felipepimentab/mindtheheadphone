import { del, put } from '@vercel/blob';
import type { MultiPartData } from 'h3';
import { createError } from 'h3';
import mongoose from 'mongoose';
import { DEVICES_FOLDER } from '~~/shared/types/device';
import type { DeviceType } from '~~/shared/types/device';
import { DeviceSchema } from '~~/server/models/device.schema';

const IMAGE_CACHE_MAX_AGE = 60 * 60 * 24 * 365;
const DEVICE_TYPE_ALIASES: Record<string, DeviceType> = {
  electronic: 'Eletrônico',
  electronics: 'Eletrônico',
  eletronico: 'Eletrônico',
  eletronicos: 'Eletrônico',
  earphone: 'Earphone',
  earphones: 'Earphone',
  headphone: 'Headphone',
  headphones: 'Headphone'
};

export async function uploadDeviceImage(image: MultiPartData, slug: string) {
  const imageType = image.type?.split('/')[1] || 'bin';
  const salt = crypto.randomUUID();
  const imagePath = `${DEVICES_FOLDER}/${slug}-${salt}.${imageType}`;

  return await put(imagePath, image.data, {
    access: 'public',
    addRandomSuffix: false,
    cacheControlMaxAge: IMAGE_CACHE_MAX_AGE,
    contentType: image.type
  });
}

export async function deleteDeviceImage(url?: string) {
  if (!url) return;
  await del(url);
}

export function getDeviceLookup(identifier: string) {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return {
      $or: [
        { _id: identifier },
        { slug: identifier }
      ]
    };
  }

  return { slug: identifier };
}

export async function findDeviceOrThrow(identifier: string) {
  const device = await DeviceSchema.findOne(getDeviceLookup(identifier));
  if (!device) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Device not found'
    });
  }

  return device;
}

export function resolveDeviceType(type?: string | string[]) {
  const value = Array.isArray(type) ? type[0] : type;
  if (!value) return undefined;

  return DEVICE_TYPE_ALIASES[value.toLowerCase()] || value as DeviceType;
}
