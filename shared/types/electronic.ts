import { Device } from './device';

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
