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

/**
 * Checks if a normalized search term is found within a normalized target string
 *
 * @param target - The string to search in
 * @param searchTerm - The term to search for
 * @returns True if the search term is found in the target string
 *
 * @example
 * searchInString("Fone de Ouvido Sennheiser", "senn") // true
 * searchInString("Áudio Premium", "audio") // true
 */
export function searchInString(target: string, searchTerm: string): boolean {
  if (!searchTerm.trim()) return true;

  const normalizedTarget = normalizeString(target);
  const normalizedSearch = normalizeString(searchTerm);

  return normalizedTarget.includes(normalizedSearch);
}

/**
 * Normalizes an array of strings for search indexing
 *
 * @param strings - Array of strings to normalize
 * @returns Array of normalized strings
 */
export function normalizeStringArray(strings: string[]): string[] {
  return strings.map(normalizeString);
}
