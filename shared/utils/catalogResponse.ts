import { createError } from 'h3';
import { deviceTypes } from '../types/device';
import type { Device } from '../types/device';

const nullableCatalogFields = ['overview', 'signature', 'buy', 'review', 'tags'] as const;

function normalizeCatalogDevice(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  const device = value as Record<string, unknown>;
  const nullFields = nullableCatalogFields.filter(key => device[key] === null);
  if (!nullFields.length) return value;

  const normalized = { ...device };
  for (const key of nullFields) normalized[key] = undefined;
  return normalized;
}

function isCatalogDevice(value: unknown): value is Device {
  if (!value || typeof value !== 'object') return false;
  const device = value as Record<string, unknown>;

  // Keep optional legacy fields compatible with the persisted schema (A10).
  return ['name', 'slug', 'img', 'category'].every(key => typeof device[key] === 'string' && device[key] !== '')
    && typeof device.price === 'number' && Number.isFinite(device.price)
    && typeof device.imported === 'boolean'
    && deviceTypes.some(type => type === device.type)
    && ['overview', 'signature', 'buy', 'review'].every(key => device[key] === undefined || typeof device[key] === 'string')
    && (device.tags === undefined || (Array.isArray(device.tags) && device.tags.every(tag => typeof tag === 'string')));
}

export function getCatalogDevices(data: unknown, fetchError?: unknown): Device[] {
  const normalized = Array.isArray(data) ? data.map(normalizeCatalogDevice) : [];
  if (fetchError || !Array.isArray(data) || !normalized.every(isCatalogDevice)) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Catalog temporarily unavailable',
      message: 'O catálogo está temporariamente indisponível. Tente novamente mais tarde.'
    });
  }
  // Preserve the original array when no legacy null values needed normalization.
  return normalized.every((device, index) => device === data[index]) ? data : normalized;
}
