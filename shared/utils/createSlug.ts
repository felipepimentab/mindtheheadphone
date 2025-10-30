/**
 * Creates a URL-friendly slug from a string
 * @param text - The input string to convert to a slug
 * @returns A lowercase, hyphenated slug string
 */
export function createSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove accents and special characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove any character that isn't alphanumeric or hyphen
    .replace(/[^a-z0-9-]/g, '')
    // Replace multiple consecutive hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Creates a slug with a maximum length limit
 * @param text - The input string to convert to a slug
 * @param maxLength - Maximum length of the resulting slug (default: 50)
 * @returns A truncated slug string
 */
export function createSlugWithLimit(text: string, maxLength: number = 50): string {
  const slug = createSlug(text);

  if (slug.length <= maxLength) {
    return slug;
  }

  // Truncate at word boundary if possible
  const truncated = slug.substring(0, maxLength);
  const lastHyphen = truncated.lastIndexOf('-');

  // If there's a hyphen within the last 10 characters, cut there
  if (lastHyphen > maxLength - 10) {
    return truncated.substring(0, lastHyphen);
  }

  return truncated;
}
