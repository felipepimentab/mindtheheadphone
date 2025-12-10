import type { Receiver } from '~~/shared/types/receiver';

export type FilterStrategy = (params: FilterParams, devices: Receiver[]) => Receiver[];
export type FilterChain = FilterStrategy[];

export const filterByMin: FilterStrategy = (params, devices) => {
  const { min = MIN_PRICE } = params;
  return devices.filter(d => d.price >= min);
};

export const filterByMax: FilterStrategy = (params, device) => {
  const { max = MAX_PRICE } = params;
  return device.filter(d => d.price <= (max || MAX_PRICE));
};

export const filterByCategory: FilterStrategy = (params, devices) => {
  const { category = [] } = params;
  if (!category.length) return devices;

  return devices.filter(d => category.includes(d.category));
};

export const filterBySignature: FilterStrategy = (params, devices) => {
  const { signature = [] } = params;
  if (!signature.length) return devices;

  return devices.filter(d => signature.includes(d.signature));
};

export const filterBySearch: FilterStrategy = (params, devices) => {
  const { search = '' } = params;
  if (!search.trim()) return devices;

  return devices.filter(hp => normalizeString(hp.name).includes(normalizeString(search)));
};

export const orderBy: FilterStrategy = (params, devices) => {
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
