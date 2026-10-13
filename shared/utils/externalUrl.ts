/** Return only absolute web URLs that are safe to use in outbound links. */
export function safeExternalUrl(value?: string): string | undefined {
  const url = value?.trim();
  if (!url || !/^https?:\/\//i.test(url) || url.includes('\\')
    || Array.from(url).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) return undefined;

  try {
    const parsed = new URL(url);
    if ((parsed.protocol !== 'http:' && parsed.protocol !== 'https:') || !parsed.hostname || parsed.username || parsed.password) {
      return undefined;
    }

    return url;
  } catch {
    return undefined;
  }
}
