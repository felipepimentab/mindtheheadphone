import type { Device, DeviceType } from '../../shared/types/device';
import { earphoneCategories } from '../../shared/types/earphone';
import { headphoneCategories } from '../../shared/types/headphone';
import { electronicCategories } from '../../shared/types/electronic';

export const adminDeviceCategories: Record<DeviceType, readonly string[]> = {
  Earphone: earphoneCategories,
  Headphone: headphoneCategories,
  Eletrônico: electronicCategories
};

export const adminPriceRanges = [
  { label: 'Todos os preços', value: 'all' },
  { label: 'Até R$ 500', value: 'up-to-500' },
  { label: 'Acima de R$ 500 até R$ 1.000', value: '500-to-1000' },
  { label: 'Acima de R$ 1.000 até R$ 2.000', value: '1000-to-2000' },
  { label: 'Acima de R$ 2.000', value: 'over-2000' }
] as const;

export type AdminDeviceFilters = {
  search: string
  type: string
  category: string
  signature: string
  price: typeof adminPriceRanges[number]['value']
  tag: string
  origin: 'all' | 'imported' | 'domestic' | 'unknown'
  buy: 'all' | 'with' | 'without'
  review: 'all' | 'with' | 'without'
};

export function createAdminDeviceFilters(): AdminDeviceFilters {
  return {
    search: '', type: 'all', category: 'all', signature: 'all', price: 'all',
    tag: 'all', origin: 'all', buy: 'all', review: 'all'
  };
}

function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('pt-BR').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

export function filterAdminDevices(devices: Device[], filters: AdminDeviceFilters) {
  const terms = normalizeSearch(filters.search).split(/\s+/).filter(Boolean);

  return devices.filter((device) => {
    if (filters.type !== 'all' && device.type !== filters.type) return false;
    if (filters.category === '__missing__' ? !!device.category : filters.category !== 'all' && device.category !== filters.category) return false;
    if (filters.signature === '__missing__' ? !!device.signature : filters.signature !== 'all' && device.signature !== filters.signature) return false;
    if (filters.tag === '__missing__' ? !!device.tags?.length : filters.tag !== 'all' && !device.tags?.includes(filters.tag)) return false;

    const hasReview = !!device.review?.trim();
    if (filters.review === 'with' && !hasReview) return false;
    if (filters.review === 'without' && hasReview) return false;

    const hasBuyLink = !!device.buy?.trim();
    if (filters.buy === 'with' && !hasBuyLink) return false;
    if (filters.buy === 'without' && hasBuyLink) return false;

    const origin = device.imported === true ? 'imported' : device.imported === false ? 'domestic' : 'unknown';
    if (filters.origin !== 'all' && origin !== filters.origin) return false;

    switch (filters.price) {
      case 'up-to-500':
        if (device.price > 500) return false;
        break;
      case '500-to-1000':
        if (device.price <= 500 || device.price > 1000) return false;
        break;
      case '1000-to-2000':
        if (device.price <= 1000 || device.price > 2000) return false;
        break;
      case 'over-2000':
        if (device.price <= 2000) return false;
        break;
    }

    if (!terms.length) return true;

    const searchable = normalizeSearch([
      device.name, device.slug, device.overview, device.type, device.category,
      device.signature, ...(device.tags || [])
    ].filter(Boolean).join(' '));
    return terms.every(term => searchable.includes(term));
  });
}
