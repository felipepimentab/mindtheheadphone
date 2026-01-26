/**
 * Describes the perceived tonal balance of a personal audio device.
 */
export const soundSignatures = [
  'Enérgico',
  'Natural',
  'Neutro-Quente',
  'Neutro-Frio',
  'Musical',
  'Basshead',
  'V-Shaped Forte'
] as const;

export const colorReference: Record<SoundSignature, string[]> = {
  'Enérgico': [
    `text-ss-energetico-400`,
    `bg-ss-energetico-700/30`
  ],
  'Natural': [
    `text-ss-natural-400`,
    `bg-ss-natural-700/30`
  ],
  'Neutro-Quente': [
    `text-ss-neutro-quente-400`,
    `bg-ss-neutro-quente-700/30`
  ],
  'Neutro-Frio': [
    `text-ss-neutro-frio-400`,
    `bg-ss-neutro-frio-700/30`
  ],
  'Musical': [
    `text-ss-musical-400`,
    `bg-ss-musical-700/30`
  ],
  'Basshead': [
    `text-ss-basshead-400`,
    `bg-ss-basshead-700/30`
  ],
  'V-Shaped Forte': [
    `text-ss-v-shaped-400`,
    `bg-ss-v-shaped-700/30`
  ]
};

export const colorName: Record<SoundSignature, SoundSignatureSemanticColor> = {
  'Enérgico': 'ss-energetico',
  'Natural': 'ss-natural',
  'Neutro-Quente': 'ss-neutro-quente',
  'Neutro-Frio': 'ss-neutro-frio',
  'Musical': 'ss-musical',
  'Basshead': 'ss-basshead',
  'V-Shaped Forte': 'ss-v-shaped'
} as const;

type SoundSignatureSemanticColor = 'ss-energetico' | 'ss-natural' | 'ss-neutro-quente' | 'ss-neutro-frio' | 'ss-musical' | 'ss-basshead' | 'ss-v-shaped';

export function semanticColor(s: SoundSignature): SoundSignatureSemanticColor {
  return colorName[s];
}

/**
 * Union of all possible sound signature keys.
 */
export type SoundSignature = typeof soundSignatures[number];
