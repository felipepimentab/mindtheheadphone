import { describe, expect, test } from 'bun:test';
import type { MultiPartData } from 'h3';
import mongoose from 'mongoose';
import { parseDeviceForm, throwDeviceWriteError } from '../server/utils/deviceValidation';
import { safeExternalUrl } from '../shared/utils/externalUrl';

function field(name: string, value: string, type?: string): MultiPartData {
  return { name, data: Buffer.from(value), type };
}

function validForm(): MultiPartData[] {
  return [
    field('name', '  Fone   de teste  '),
    field('type', 'Earphone'),
    field('category', 'Earbud'),
    field('signature', 'Natural'),
    field('price', '199.90'),
    field('imported', '0'),
    field('overview', '  Descrição útil  '),
    field('buy', ' https://example.com/buy '),
    field('review', ''),
    field('tags[0]', '  Favorito do canal '),
    field('tags[1]', 'favorito do canal'),
    field('image', 'placeholder', 'image/png')
  ];
}

function statusCode(run: () => unknown): number | undefined {
  try {
    run();
    return undefined;
  } catch (error) {
    return (error as { statusCode?: number }).statusCode;
  }
}

describe('device write contract', () => {
  test('normalizes valid creation before an image is uploaded', () => {
    const { deviceData, image } = parseDeviceForm(validForm(), { requireImage: true });
    expect(deviceData).toMatchObject({
      name: 'Fone de teste',
      slug: 'fone-de-teste',
      price: 199.9,
      imported: false,
      overview: 'Descrição útil',
      buy: 'https://example.com/buy',
      tags: ['Favorito do canal']
    });
    expect(image?.type).toBe('image/png');
  });

  test('rejects missing and incompatible fields', () => {
    for (const [name, replacement] of [
      ['name', '   '],
      ['name', '🎧'],
      ['type', 'Speaker'],
      ['category', 'Headphone Gamer'],
      ['signature', 'Invalid'],
      ['price', '-1'],
      ['price', 'Infinity'],
      ['price', '50626'],
      ['imported', 'perhaps'],
      ['overview', '   '],
      ['buy', 'javascript:alert(1)'],
      ['buy', 'ftp://example.com'],
      ['buy', 'https://user:pass@example.com']
    ]) {
      const form = validForm().map(item => item.name === name ? field(name, replacement, item.type) : item);
      expect(statusCode(() => parseDeviceForm(form, { requireImage: true }))).toBe(400);
    }
    expect(statusCode(() => parseDeviceForm(validForm().filter(item => item.name !== 'signature'), { requireImage: true }))).toBe(400);
    expect(statusCode(() => parseDeviceForm(validForm().filter(item => item.name !== 'image'), { requireImage: true }))).toBe(400);
  });

  test('requires category and signature to agree with the type', () => {
    const electronic = validForm().map(item => item.name === 'type' ? field('type', 'Eletrônico') : item)
      .map(item => item.name === 'category' ? field('category', 'Player portátil') : item);
    expect(statusCode(() => parseDeviceForm(electronic, { requireImage: true }))).toBe(400);
    expect(parseDeviceForm(electronic.filter(item => item.name !== 'signature'), { requireImage: true }).deviceData.type).toBe('Eletrônico');
  });

  test('keeps omitted update fields and validates the resulting record', () => {
    const existing = {
      name: 'Fone de teste',
      type: 'Earphone' as const,
      category: 'Earbud',
      signature: 'Natural' as const,
      price: 100,
      imported: false,
      overview: 'Descrição',
      tags: ['Atual'],
      buy: 'https://example.com',
      review: ''
    };
    expect(parseDeviceForm([field('price', '250')], { requireImage: false, existing }).deviceData).toEqual({ price: 250 });
    const cleared = parseDeviceForm([field('tags', '[]')], { requireImage: false, existing }).deviceData;
    expect(cleared).toEqual({ tags: [] });
    expect({ ...existing, ...cleared }.tags).toEqual([]);
    expect(statusCode(() => parseDeviceForm([field('type', 'Headphone')], { requireImage: false, existing }))).toBe(400);
    expect(parseDeviceForm([
      field('type', 'Eletrônico'),
      field('category', 'Player portátil')
    ], { requireImage: false, existing }).deviceData).toEqual({
      type: 'Eletrônico',
      category: 'Player portátil',
      signature: undefined
    });
  });

  test('rejects malformed, duplicate, or mixed empty-tag fields', () => {
    const formWithoutTags = validForm().filter(item => !item.name?.startsWith('tags['));
    expect(parseDeviceForm([...formWithoutTags, field('tags', '[]')], { requireImage: true }).deviceData.tags).toEqual([]);
    for (const fields of [
      [field('tags', '')],
      [field('tags', '["unexpected"]')],
      [field('tags', '[]'), field('tags', '[]')],
      [field('tags', '[]'), field('tags[0]', 'Conflicting')],
      [field('tags[0]', 'Conflicting'), field('tags', '[]')]
    ]) {
      expect(statusCode(() => parseDeviceForm([...formWithoutTags, ...fields], { requireImage: true }))).toBe(400);
    }
  });

  test('rejects duplicated, sparse, unknown, and excessive fields', () => {
    for (const extra of [
      field('name', 'Duplicate'),
      field('tags[3]', 'Gap'),
      field('tags[20]', 'Too many'),
      field('other', 'Unexpected')
    ]) {
      expect(statusCode(() => parseDeviceForm([...validForm(), extra], { requireImage: true }))).toBe(400);
    }
    expect(statusCode(() => parseDeviceForm([
      ...validForm().filter(item => !item.name?.startsWith('tags[')),
      field('tags[0]', 'x'.repeat(61))
    ], { requireImage: true }))).toBe(400);
  });
});

describe('public links and database errors', () => {
  test('only allows absolute web links without credentials', () => {
    expect(safeExternalUrl(' https://example.com/path ')).toBe('https://example.com/path');
    expect(safeExternalUrl('http://example.com')).toBe('http://example.com');
    for (const url of ['javascript:alert(1)', 'data:text/html,x', 'ftp://example.com', '/relative', 'https://user@host.test', 'https://host.test\\@evil.test']) {
      expect(safeExternalUrl(url)).toBeUndefined();
    }
  });

  test('maps duplicate keys to 409 and Mongoose validation to 400', () => {
    expect(statusCode(() => throwDeviceWriteError({ code: 11000 }))).toBe(409);
    expect(statusCode(() => throwDeviceWriteError(new mongoose.Error.ValidationError()))).toBe(400);
  });
});
