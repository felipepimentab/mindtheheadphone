import type { Device } from '~~/shared/types/device';
import type { Receiver } from '~~/shared/types/receiver';

export type FilterStrategy<T extends Device> = (params: FilterParams, devices: T[]) => T[];
export type FilterChain<T extends Device> = FilterStrategy<T>[];

export const filterByMin: FilterStrategy<Device> = (params, devices) => {
  const { min = MIN_PRICE } = params;
  return devices.filter(d => d.price >= min);
};

export const filterByMax: FilterStrategy<Device> = (params, device) => {
  const { max = MAX_PRICE } = params;
  return device.filter(d => d.price <= (max || MAX_PRICE));
};

export const filterByCategory: FilterStrategy<Device> = (params, devices) => {
  const { category = [] } = params;
  if (!category.length) return devices;

  return devices.filter(d => category.includes(d.category));
};

export const filterBySignature: FilterStrategy<Receiver> = (params, devices) => {
  const { signature = [] } = params;
  if (!signature.length) return devices;

  return devices.filter(d => signature.includes(d.signature));
};

export const filterBySearch: FilterStrategy<Device> = (params, devices) => {
  const { search = '' } = params;
  if (!search.trim()) return devices;

  return devices.filter(hp => normalizeString(hp.name).includes(normalizeString(search)));
};

export const orderBy: FilterStrategy<Device> = (params, devices) => {
  const { order = DEFAULT_ORDER } = params;

  return [...devices].sort((a, b) => {
    switch (order) {
      case 'ascending':
        return a.price - b.price;
      case 'descending':
        return b.price - a.price;
      case 'alphabetic':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
};
