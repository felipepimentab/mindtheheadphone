type link = string;
export const headphoneCategories = ['Intra-auricular', 'Earbud', 'Intra-auricular Bluetooth', 'Earbud Bluetooth', 'Headphone Cabeado', 'Headphone Bluetooth', 'Headphone Gamer'] as const;
export type HeadphoneCategory = typeof headphoneCategories[number];
export const soundSignatures = ['Enérgico', 'Natural', 'Neutro-Quente', 'Analítico', 'Seco/Direto', 'Neutro-Frio', 'Musical', 'Basshead', 'V-Shaped Forte'];
export type SoundSignature = typeof soundSignatures[number];

export interface Headphone {
  name: string
  img: link
  tags: string[]
  signature: SoundSignature
  category: HeadphoneCategory
  price: number
  overview: string
  buy: link
  review: link
}
