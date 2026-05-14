import { del, put } from '@vercel/blob';
import type { MultiPartData } from 'h3';
import { createError } from 'h3';
import mongoose from 'mongoose';
import { DeviceFormKeys, DEVICES_FOLDER } from '~~/shared/types/device';
import type { DeviceType } from '~~/shared/types/device';
import { createSlugWithLimit } from '~~/shared/utils/createSlug';
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

type DevicePayload = {
  name?: string
  price?: number
  overview?: string
  review?: string
  buy?: string
  category?: string
  imported?: boolean
  tags?: string[]
  signature?: string
  slug?: string
  type?: string
};

function getString(form: MultiPartData[], name: string) {
  const value = form.find(field => field.name === name)?.data.toString();
  return value === undefined ? undefined : value;
}

function getNumber(form: MultiPartData[], name: string) {
  const value = getString(form, name);
  return value ? Number(value) : undefined;
}

function getBoolean(form: MultiPartData[], name: string) {
  const value = getString(form, name);
  return value === undefined ? undefined : value === '1' || value === 'true';
}

function getArray(form: MultiPartData[], name: string) {
  const values: string[] = [];

  for (let index = 0; ; index++) {
    const value = getString(form, `${name}[${index}]`);
    if (!value) break;
    values.push(value);
  }

  return values;
}

export function parseDeviceForm(form: MultiPartData[], options: { requireImage: boolean }) {
  const name = getString(form, DeviceFormKeys.NAME);
  const slug = name ? createSlugWithLimit(name) : undefined;
  const image = form.find(field => field.name === DeviceFormKeys.IMAGE);

  if (options.requireImage && !image) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Device image is required'
    });
  }

  if (image && !image.type?.startsWith('image/')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File is not an image'
    });
  }

  const tags = getArray(form, DeviceFormKeys.TAGS);
  const imported = getBoolean(form, DeviceFormKeys.IMPORTED);
  const rawDeviceData: DevicePayload = {
    name,
    price: getNumber(form, DeviceFormKeys.PRICE),
    overview: getString(form, DeviceFormKeys.OVERVIEW),
    review: getString(form, DeviceFormKeys.REVIEW),
    buy: getString(form, DeviceFormKeys.BUY),
    category: getString(form, DeviceFormKeys.CATEGORY),
    imported,
    tags: tags.length ? tags : undefined,
    signature: getString(form, DeviceFormKeys.SIGNATURE),
    slug,
    type: getString(form, DeviceFormKeys.TYPE)
  };
  const deviceData = Object.fromEntries(
    Object.entries(rawDeviceData).filter(([, value]) => value !== undefined)
  ) as DevicePayload;

  return {
    deviceData,
    image
  };
}

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
