/**
 * Describes the perceived tonal balance of a personal audio device.
 */
export const soundSignatures = [
  'Enérgico',
  'Natural',
  'Neutro-Quente',
  'Analítico',
  'Seco/Direto',
  'Neutro-Frio',
  'Musical',
  'Basshead',
  'V-Shaped Forte'
] as const;

/**
 * Union of all possible sound signature keys.
 */
export type SoundSignature = typeof soundSignatures[number];
