const recommendationPaths = [
  '/recomendacoes/eletronicos',
  '/recomendacoes/earphones',
  '/recomendacoes/headphones'
];

export async function revalidateRecommendations() {
  if (process.env.VERCEL_ENV !== 'production') return;

  const token = process.env.BYPASS_TOKEN;
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (!token || !host) {
    console.error('[ISR] Revalidation skipped: BYPASS_TOKEN or VERCEL_PROJECT_PRODUCTION_URL is missing');
    return;
  }

  // Nuxt caches navigation payloads separately from the page HTML.
  const paths = recommendationPaths.flatMap(path => [path, `${path}/_payload.json`]);
  await Promise.all(paths.map(async (path) => {
    try {
      const response = await fetch(`https://${host}${path}`, {
        method: 'HEAD',
        headers: { 'x-prerender-revalidate': token },
        redirect: 'error',
        signal: AbortSignal.timeout(10_000)
      });

      if (!response.ok) {
        console.error('[ISR] Revalidation failed', { path, status: response.status });
        return;
      }

      console.info('[ISR] Revalidated', path);
    } catch (error) {
      console.error('[ISR] Revalidation failed', { path, message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }));
}
