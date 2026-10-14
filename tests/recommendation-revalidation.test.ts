import { afterEach, beforeEach, describe, expect, spyOn, test } from 'bun:test';
import { revalidateRecommendations } from '../server/utils/revalidateRecommendations';

const paths = [
  '/recomendacoes/eletronicos', '/recomendacoes/eletronicos/_payload.json',
  '/recomendacoes/earphones', '/recomendacoes/earphones/_payload.json',
  '/recomendacoes/headphones', '/recomendacoes/headphones/_payload.json'
];
const environmentKeys = ['VERCEL_ENV', 'BYPASS_TOKEN', 'NUXT_APP_ORIGIN', 'VERCEL_PROJECT_PRODUCTION_URL'] as const;
const originalEnvironment = Object.fromEntries(environmentKeys.map(key => [key, process.env[key]]));
let request: ReturnType<typeof spyOn<typeof globalThis, 'fetch'>>;
let info: ReturnType<typeof spyOn<typeof console, 'info'>>;
let error: ReturnType<typeof spyOn<typeof console, 'error'>>;

beforeEach(() => {
  process.env.VERCEL_ENV = 'production';
  process.env.BYPASS_TOKEN = 'test-secret';
  process.env.NUXT_APP_ORIGIN = 'https://www.example.com';
  process.env.VERCEL_PROJECT_PRODUCTION_URL = 'example.com';
  request = spyOn(globalThis, 'fetch').mockImplementation(async () => new Response(null));
  info = spyOn(console, 'info').mockImplementation(() => {});
  error = spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  request.mockRestore();
  info.mockRestore();
  error.mockRestore();
  for (const key of environmentKeys) {
    const value = originalEnvironment[key];
    if (value === undefined) Reflect.deleteProperty(process.env, key);
    else process.env[key] = value;
  }
});

describe('on-demand recommendation revalidation', () => {
  test('refreshes every page and navigation payload on the configured origin using the private header', async () => {
    await revalidateRecommendations();
    expect(request.mock.calls.map(([url]) => url)).toEqual(paths.map(path => `https://www.example.com${path}`));
    for (const [, options] of request.mock.calls) {
      expect(options).toMatchObject({
        method: 'HEAD',
        headers: { 'x-prerender-revalidate': 'test-secret' },
        redirect: 'error'
      });
      expect(options?.signal).toBeInstanceOf(AbortSignal);
    }
    expect(info).toHaveBeenCalledTimes(6);
    expect(error).not.toHaveBeenCalled();
  });

  test('accepts a configured origin with a trailing slash without changing request paths', async () => {
    process.env.NUXT_APP_ORIGIN = 'https://www.example.com/';
    await revalidateRecommendations();
    expect(request.mock.calls.map(([url]) => url)).toEqual(paths.map(path => `https://www.example.com${path}`));
  });

  test('never triggers requests outside Vercel production', async () => {
    for (const environment of ['preview', 'development', undefined]) {
      if (environment === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = environment;
      await revalidateRecommendations();
    }
    expect(request).not.toHaveBeenCalled();
    expect(info).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  test('logs missing configuration without sending a request', async () => {
    delete process.env.BYPASS_TOKEN;
    await revalidateRecommendations();
    process.env.BYPASS_TOKEN = 'test-secret';
    delete process.env.NUXT_APP_ORIGIN;
    await revalidateRecommendations();
    expect(request).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(2);
  });

  test('logs HTTP and network failures while still attempting the remaining paths', async () => {
    request.mockImplementationOnce(async () => new Response(null, { status: 500 }));
    request.mockImplementationOnce(async () => {
      throw new Error('Connection failed');
    });
    await expect(revalidateRecommendations()).resolves.toBeUndefined();
    expect(request).toHaveBeenCalledTimes(6);
    expect(info).toHaveBeenCalledTimes(4);
    expect(error).toHaveBeenCalledTimes(2);
    expect(error.mock.calls).toEqual([
      ['[ISR] Revalidation failed', { path: paths[0], status: 500 }],
      ['[ISR] Revalidation failed', { path: paths[1], message: 'Connection failed' }]
    ]);
  });
});
