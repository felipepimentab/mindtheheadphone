export default defineEventHandler(async () => {
  const channelId = 'UC7fN3sq7h2BDFtBrzXWo4Zg';
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return createError({
      statusCode: 400,
      statusMessage: 'Missing API key'
    });
  }

  const apiUrl = new URL('https://www.googleapis.com/youtube/v3/channels');
  const params = new URLSearchParams({
    part: 'statistics',
    id: channelId,
    key: apiKey
  });
  params.keys().forEach(key => apiUrl.searchParams.append(key, params.get(key) as string));

  const response = await $fetch(apiUrl.toString());
  return response;
});
