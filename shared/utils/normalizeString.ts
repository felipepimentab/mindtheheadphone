/**
 * Normalizes a string for search purposes by:
 * - Converting to lowercase
 * - Removing accents and diacritics
 * - Trimming whitespace
 * - Replacing multiple spaces with single spaces
 *
 * @param str - The string to normalize
 * @returns The normalized string
 *
 * @example
 * normalizeString("Ação Especial") // "acao especial"
 * normalizeString("  CAFÉ  ") // "cafe"
 * normalizeString("Naïve résumé") // "naive resume"
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics/accents
    .trim()
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
}
