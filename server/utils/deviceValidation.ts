import type { MultiPartData } from 'h3';
import { createError } from 'h3';
import mongoose from 'mongoose';
import * as z from 'zod';
import { deviceTypes, DeviceFormKeys } from '../../shared/types/device';
import type { Device, DeviceType } from '../../shared/types/device';
import { earphoneCategories } from '../../shared/types/earphone';
import { headphoneCategories } from '../../shared/types/headphone';
import { electronicCategories } from '../../shared/types/electronic';
import { soundSignatures } from '../../shared/types/soundSignatures';
import { createSlugWithLimit } from '../../shared/utils/createSlug';
import { MAX_DEVICE_PRICE } from '../../shared/utils/devicePrice';
import { safeExternalUrl } from '../../shared/utils/externalUrl';

const MAX_TAGS = 20;
const MAX_TAG_LENGTH = 60;
const MAX_NAME_LENGTH = 160;
const MAX_OVERVIEW_LENGTH = 2_000;
const MAX_URL_LENGTH = 2_048;

const categoriesByType: Record<DeviceType, readonly string[]> = {
  Earphone: earphoneCategories,
  Headphone: headphoneCategories,
  Eletrônico: electronicCategories
};

const requiredText = (max: number) => z.string().trim().min(1).max(max);
const nameField = z.string()
  .transform(value => value.trim().replace(/\s+/g, ' '))
  .pipe(z.string().min(1).max(MAX_NAME_LENGTH))
  .refine(value => Boolean(createSlugWithLimit(value)), 'Name must produce a non-empty slug');
const urlField = z.string().trim().max(MAX_URL_LENGTH)
  .refine(value => !value || safeExternalUrl(value) !== undefined, 'Use an absolute HTTP(S) URL without credentials');
const priceField = z.union([
  z.number(),
  z.string().trim().max(20).regex(/^\d+(?:\.\d{1,2})?$/).transform(Number)
]).pipe(z.number().finite().min(0).max(MAX_DEVICE_PRICE));
const importedField = z.union([
  z.boolean(),
  z.enum(['0', '1', 'false', 'true']).transform(value => value === '1' || value === 'true')
]);
const tagField = z.string()
  .transform(value => value.trim().replace(/\s+/g, ' '))
  .pipe(z.string().min(1).max(MAX_TAG_LENGTH));

const deviceFields = z.strictObject({
  name: nameField,
  type: z.enum(deviceTypes),
  category: requiredText(80),
  signature: z.enum(soundSignatures).optional(),
  price: priceField,
  imported: importedField,
  overview: requiredText(MAX_OVERVIEW_LENGTH),
  tags: z.array(tagField).max(MAX_TAGS).transform((tags) => {
    const seen = new Set<string>();
    return tags.filter((tag) => {
      const key = tag.toLocaleLowerCase('pt-BR');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }),
  buy: urlField.optional(),
  review: urlField.optional()
});

const deviceRecord = deviceFields.superRefine((device, ctx) => {
  if (!categoriesByType[device.type].includes(device.category)) {
    ctx.addIssue({ code: 'custom', path: ['category'], message: 'Category does not match device type' });
  }

  if (device.type === 'Eletrônico' && device.signature) {
    ctx.addIssue({ code: 'custom', path: ['signature'], message: 'Electronics cannot have a sound signature' });
  } else if (device.type !== 'Eletrônico' && !device.signature) {
    ctx.addIssue({ code: 'custom', path: ['signature'], message: 'Sound signature is required' });
  }
});

type ExistingDevice = Pick<Device, 'name' | 'type' | 'category' | 'signature' | 'price' | 'imported' | 'overview' | 'tags' | 'buy' | 'review'>;
type DevicePatch = Partial<z.output<typeof deviceFields>> & { slug?: string };

function badRequest(message: string): never {
  throw createError({ statusCode: 400, statusMessage: message });
}

function validationError(error: z.ZodError): never {
  throw createError({
    statusCode: 400,
    statusMessage: 'Invalid device data',
    data: {
      issues: error.issues.map(issue => ({ field: issue.path.join('.'), message: issue.message }))
    }
  });
}

/** Parse multipart fields without trusting browser-side validation. */
export function parseDeviceForm(form: MultiPartData[], options: { requireImage: boolean, existing?: ExistingDevice }): {
  deviceData: DevicePatch
  image?: MultiPartData
} {
  const scalarNames = new Set<string>([
    DeviceFormKeys.NAME,
    DeviceFormKeys.TYPE,
    DeviceFormKeys.CATEGORY,
    DeviceFormKeys.SIGNATURE,
    DeviceFormKeys.PRICE,
    DeviceFormKeys.IMPORTED,
    DeviceFormKeys.OVERVIEW,
    DeviceFormKeys.BUY,
    DeviceFormKeys.REVIEW
  ]);
  const raw: Record<string, unknown> = {};
  const tags = new Map<number, string>();
  let image: MultiPartData | undefined;

  for (const field of form) {
    if (field.name === DeviceFormKeys.IMAGE) {
      if (image) badRequest('Duplicate image field');
      image = field;
      continue;
    }

    const tagMatch = field.name?.match(/^tags\[(0|[1-9]\d*)\]$/);
    if (tagMatch) {
      const index = Number(tagMatch[1]);
      if (index >= MAX_TAGS || tags.has(index)) badRequest('Invalid tags');
      tags.set(index, field.data.toString());
      continue;
    }

    if (!field.name || !scalarNames.has(field.name) || Object.hasOwn(raw, field.name)) {
      badRequest('Unknown or duplicate device field');
    }
    raw[field.name] = field.data.toString();
  }

  if (tags.size) {
    if (Array.from(tags.keys()).some(index => index >= tags.size)) badRequest('Invalid tags');
    raw.tags = Array.from({ length: tags.size }, (_, index) => tags.get(index));
  } else if (!options.existing) {
    raw.tags = [];
  }

  if (options.requireImage && !image) badRequest('Device image is required');
  if (image && !image.type?.startsWith('image/')) badRequest('File is not an image');

  const patch = deviceFields.partial().safeParse(raw);
  if (!patch.success) validationError(patch.error);

  // The edit form omits signature when switching to electronics.
  if (options.existing && patch.data.type === 'Eletrônico' && !Object.hasOwn(patch.data, 'signature')) {
    patch.data.signature = undefined;
  }

  const existing = options.existing;
  const candidate = existing
    ? {
        name: existing.name,
        type: existing.type,
        category: existing.category,
        signature: existing.signature || undefined,
        price: existing.price,
        imported: existing.imported,
        overview: existing.overview,
        tags: existing.tags || [],
        buy: existing.buy,
        review: existing.review,
        ...patch.data
      }
    : patch.data;
  const record = deviceRecord.safeParse(candidate);
  if (!record.success) validationError(record.error);

  const deviceData: DevicePatch = existing ? patch.data : record.data;
  if (deviceData.name) deviceData.slug = createSlugWithLimit(deviceData.name);

  return { deviceData, image };
}

export function throwDeviceWriteError(error: unknown): never {
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
    throw createError({ statusCode: 409, statusMessage: 'Device name or slug already exists' });
  }

  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid device data' });
  }

  throw error;
}
