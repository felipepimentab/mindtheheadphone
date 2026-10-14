import { describe, expect, test } from 'bun:test';
import { getCatalogDevices } from '../shared/utils/catalogResponse';

const device = {
  name: 'Test headphone', slug: 'test-headphone', img: 'https://example.com/image.webp',
  category: 'Headphone', price: 100, imported: false, type: 'Headphone',
  overview: 'Description', tags: ['Test'], signature: 'Natural'
};

describe('catalog read failures', () => {
  test('retains valid records and genuinely empty categories', () => {
    const data = [device];
    expect(getCatalogDevices(data)).toBe(data);
    expect(getCatalogDevices([], null)).toEqual([]);
    const legacy = { ...device, overview: undefined, tags: undefined };
    expect(getCatalogDevices([legacy])).toEqual([legacy]);
  });

  test('normalizes nullable legacy fields without mutating the fetched records', () => {
    const legacy = { ...device, overview: null, signature: null, buy: null, review: null, tags: null };
    const data = [legacy, device];
    const normalized = getCatalogDevices(data);

    expect(normalized[0]).toEqual({
      ...legacy, overview: undefined, signature: undefined, buy: undefined, review: undefined, tags: undefined
    });
    expect(normalized[1]).toBe(device);
    expect(data[0]).toBe(legacy);
    expect(legacy).toMatchObject({ overview: null, signature: null, buy: null, review: null, tags: null });
  });

  test('fails on fetch errors even when a previous array or an empty default is present', () => {
    for (const data of [[], [device], null]) {
      expect(() => getCatalogDevices(data, new Error('private database connection error'))).toThrow();
      try {
        getCatalogDevices(data, new Error('private database connection error'));
      } catch (error) {
        expect(error).toMatchObject({ statusCode: 503 });
        expect(String(error)).not.toContain('private database connection error');
      }
    }
  });

  test('rejects missing data, error-shaped responses, and malformed records', () => {
    for (const data of [
      null, undefined, { devices: [] }, { error: 'database unavailable' }, '[]',
      [null], [42], [{}], [{ ...device, price: '100' }], [{ ...device, price: Infinity }],
      [{ ...device, imported: 'false' }], [{ ...device, type: 'Unknown' }],
      [{ ...device, tags: 'Test' }], [{ ...device, tags: [null] }],
      [{ ...device, overview: 42 }], [{ ...device, signature: false }],
      [{ ...device, buy: {} }], [{ ...device, review: [] }],
      [{ ...device, name: null, review: null }]
    ]) {
      expect(() => getCatalogDevices(data)).toThrow();
    }
  });
});
