import { Device } from './device';
import type { RecommendationsList } from './recommendations';

/**
 * Electronic categories available in the system.
 */
export const electronicCategories = [
  'Amplificador/DAC portátil',
  'Amplificador/DAC de mesa',
  'Player portátil'
] as const;

/**
 * Union type of valid electronic category keys.
 */
export type ElectronicCategory = typeof electronicCategories[number];

/**
 * Represents an electronic device with its specific category.
 */
export class Electronic extends Device<ElectronicCategory> {}

export const electronicsList: RecommendationsList<typeof electronicCategories> = {
  title: 'Eletrônicos',
  description: 'Eletrônicos diversos relacionados a áudio, como amplificadores e DACs, organizados por tipo e faixa de preço.',
  path: '/recomendacoes/eletronicos',
  inverted: false,
  apiUrl: '/api/devices/electronics',
  categories: electronicCategories
};
