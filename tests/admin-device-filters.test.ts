import { describe, expect, test } from 'bun:test';
import type { Device } from '../shared/types/device';
import { createAdminDeviceFilters, filterAdminDevices } from '../app/utils/adminDeviceFilters';
import type { AdminDeviceFilters } from '../app/utils/adminDeviceFilters';

const devices: Device[] = [
  {
    name: 'Fone Áudio', slug: 'fone-audio', overview: 'Ótimo para música',
    type: 'Earphone', category: 'Intra-auricular', signature: 'Enérgico',
    tags: ['Favorito do canal'], price: 500, imported: false, img: '', review: 'https://example.com/review'
  },
  {
    name: 'Fone Bluetooth', slug: 'fone-bluetooth', overview: 'Sem fio',
    type: 'Earphone', category: 'Intra-auricular Bluetooth', signature: 'Natural',
    tags: [], price: 1000, imported: true, img: ''
  },
  {
    name: 'Headphone Natural', slug: 'headphone-natural', overview: 'Para uso em casa',
    type: 'Headphone', category: 'Headphone Cabeado', signature: 'Natural',
    tags: [], price: 2000, imported: false, img: '', review: '  '
  },
  {
    name: 'DAC de mesa', slug: 'dac-de-mesa', overview: '',
    type: 'Eletrônico', category: 'Amplificador/DAC de mesa',
    tags: [], price: 2000.01, imported: false, img: ''
  }
];

function filter(overrides: Partial<AdminDeviceFilters> = {}, items = devices) {
  return filterAdminDevices(items, { ...createAdminDeviceFilters(), ...overrides });
}

describe('admin device search and filters', () => {
  test('search ignores accents, case and punctuation, and combines words across fields', () => {
    expect(filter({ search: ' AUDIO   musica favorito ' })).toEqual([devices[0]!]);
    expect(filter({ search: 'fone-audio' })).toEqual([devices[0]!]);
    expect(filter({ search: 'ENERGICO' })).toEqual([devices[0]!]);
    expect(filter({ search: 'audio bluetooth' })).toEqual([]);
    expect(filter({ search: '   ' })).toEqual(devices);
  });

  test('combines all selected filters rather than matching any one of them', () => {
    const filters: Partial<AdminDeviceFilters> = {
      search: 'audio', type: 'Earphone', category: 'Intra-auricular', signature: 'Enérgico',
      price: 'up-to-500', tag: 'Favorito do canal', review: 'with'
    };
    expect(filter(filters)).toEqual([devices[0]!]);
    expect(filter({ ...filters, category: 'Intra-auricular Bluetooth' })).toEqual([]);
    expect(filter({ ...filters, review: 'without' })).toEqual([]);
  });

  test('price ranges cover their boundaries without gaps or overlap', () => {
    const prices = [0, 499.99, 500, 500.01, 999.99, 1000, 1000.01, 1999.99, 2000, 2000.01, 49000];
    const items = prices.map(price => ({ ...devices[0]!, price }));
    const resultPrices = (price: AdminDeviceFilters['price']) => filter({ price }, items).map(device => device.price);

    expect(resultPrices('up-to-500')).toEqual([0, 499.99, 500]);
    expect(resultPrices('500-to-1000')).toEqual([500.01, 999.99, 1000]);
    expect(resultPrices('1000-to-2000')).toEqual([1000.01, 1999.99, 2000]);
    expect(resultPrices('over-2000')).toEqual([2000.01, 49000]);
  });

  test('finds missing signatures, tags and reviews in legacy records', () => {
    const { tags: _tags, overview: _overview, ...legacy } = devices[3]!;
    const items = [...devices.slice(0, 3), legacy as Device];
    expect(filter({ signature: '__missing__' }, items)).toEqual([legacy as Device]);
    expect(filter({ tag: '__missing__' }, items)).toEqual(items.slice(1));
    expect(filter({ review: 'without' }, items)).toEqual(items.slice(1));
    expect(filter({ search: 'eletronico mesa' }, items)).toEqual([legacy as Device]);
  });

  test('reset restores the full catalog without changing records or their order', () => {
    const before = JSON.stringify(devices);
    const filters = { ...createAdminDeviceFilters(), type: 'Headphone', search: 'natural' };
    expect(filterAdminDevices(devices, filters)).toEqual([devices[2]!]);
    Object.assign(filters, createAdminDeviceFilters());
    expect(filterAdminDevices(devices, filters)).toEqual(devices);
    expect(JSON.stringify(devices)).toBe(before);
    expect(filterAdminDevices([], filters)).toEqual([]);
  });
});
