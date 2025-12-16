import { Device } from './device';
import type { RecommendationsList } from './recommendations';

/**
 * Earphone categories available in the system.
 */
export const earphoneCategories = [
  'Intra-auricular',
  'Earbud',
  'Intra-auricular Bluetooth',
  'Earbud Bluetooth'
] as const;

/**
 * Union type of valid earphone category keys.
 */
export type EarphoneCategory = typeof earphoneCategories[number];

/**
 * Represents an earphone device with its specific category.
 */
export class Earphone extends Device<EarphoneCategory> {}

export const earphonesList: RecommendationsList<typeof earphoneCategories> = {
  title: 'Earphones',
  description: 'Os fones de ouvido intra-auriculares e earbuds que mais recomendo, organizados por tipo, faixa de preço e assinatura sonora.',
  path: '/recomendacoes/earphones',
  inverted: false,
  apiUrl: '/api/devices/earphones',
  categories: earphoneCategories
};
