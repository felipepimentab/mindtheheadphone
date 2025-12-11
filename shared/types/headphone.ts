import { Device } from './device';

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
