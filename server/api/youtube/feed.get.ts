import type { YouTubeVideo } from '../../../shared/types/youtube';

export default defineEventHandler(async (event) => {
  const channelId = 'UC7fN3sq7h2BDFtBrzXWo4Zg'; // Mind the Headphone channel ID
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  try {
    const query = getQuery(event);
    const limit = parseInt(query.limit as string) || 6; // Default to 6 videos

    // Fetch RSS feed
    const response = await $fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)'
      }
    });

    // Parse XML manually to extract video data
    const videos = parseYouTubeRSS(response as string);

    setHeader(event, 'Cache-Control', 'max-age=3600, s-maxage=3600, stale-while-revalidate=86400');

    return videos.slice(0, limit); // Return specified number of videos
  } catch (error) {
    console.error('Failed to fetch YouTube feed:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch YouTube feed'
    });
  }
}); // 1 hour

function parseYouTubeRSS(xmlString: string): YouTubeVideo[] {
  const videos = [];
  const entryRegex = /<entry>(.*?)<\/entry>/gs;
  const entries = xmlString.match(entryRegex) || [];

  for (const entry of entries) {
    const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
    const title = entry.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
      || entry.match(/<title>(.*?)<\/title>/)?.[1];
    const published = entry.match(/<published>(.*?)<\/published>/)?.[1];
    const description = entry.match(/<media:description><!\[CDATA\[(.*?)\]\]><\/media:description>/)?.[1]
      || entry.match(/<media:description>(.*?)<\/media:description>/)?.[1] || '';

    if (videoId && title) {
      videos.push({
        id: videoId,
        title: decodeHtmlEntities(title),
        description: decodeHtmlEntities(description),
        publishedAt: published,
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${videoId}`
      } as YouTubeVideo);
    }
  }

  return videos;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'');
}
