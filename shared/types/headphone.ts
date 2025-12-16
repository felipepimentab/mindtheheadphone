import { Device } from './device';
import type { RecommendationsList } from './recommendations';

/**
 * Headphone categories available in the system.
 */
export const headphoneCategories = [
  'Headphone Cabeado',
  'Headphone Bluetooth',
  'Headphone Gamer'
] as const;

/**
 * Union type of valid headphone category keys.
 */
export type HeadphoneCategory = typeof headphoneCategories[number];

/**
 * Represents a headphone device with its specific category.
 */
export class Headphone extends Device<HeadphoneCategory> {}

export const headphonesList: RecommendationsList<typeof headphoneCategories> = {
  title: 'Headphones',
  description: 'Os headphones e headsets que mais recomendo, organizados por tipo, faixa de preço e assinatura sonora.',
  path: '/recomendacoes/headphones',
  inverted: true,
  apiUrl: '/api/devices/headphones',
  categories: headphoneCategories
};
