import { createSlugWithLimit } from '../utils/createSlug';

type link = string;
export const headphoneCategories = ['Intra-auricular', 'Earbud', 'Intra-auricular Bluetooth', 'Earbud Bluetooth', 'Headphone Cabeado', 'Headphone Bluetooth', 'Headphone Gamer'] as const;
export type HeadphoneCategory = typeof headphoneCategories[number];
export const soundSignatures = ['Enérgico', 'Natural', 'Neutro-Quente', 'Analítico', 'Seco/Direto', 'Neutro-Frio', 'Musical', 'Basshead', 'V-Shaped Forte'];
export type SoundSignature = typeof soundSignatures[number];

export class Headphone {
  readonly slug: string;

  constructor(
    readonly name: string,
    readonly img: link,
    readonly tags: string[],
    readonly signature: SoundSignature,
    readonly category: HeadphoneCategory,
    readonly price: number,
    readonly overview: string,
    readonly buy?: link,
    readonly review?: link
  ) {
    this.slug = createSlugWithLimit(name);
  }
}
