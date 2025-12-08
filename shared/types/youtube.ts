/**
 * Represents a single video fetched from the YouTube RSS feed.
 */
export interface YouTubeVideo {
  /**
   * YouTube video ID (unique).
   */
  id: string
  /**
   * Video title.
   */
  title: string
  /**
   * Short description or snippet.
   */
  description: string
  /**
   * ISO 8601 publish timestamp.
   */
  publishedAt: string
  /**
   * URL to the highest-resolution thumbnail available.
   */
  thumbnail: string
  /**
   * Full YouTube watch URL.
   */
  url: string
}
