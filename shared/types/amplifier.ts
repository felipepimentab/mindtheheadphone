import { Device } from './device';

/**
 * Amplifier categories available in the system.
 */
export const amplifierCategories = [
  'Dongles',
  'Amplificador e DAC'
] as const;

/**
 * Union type of valid amplifier category keys.
 */
export type AmplifierCategory = typeof amplifierCategories[number];

/**
 * Represents an amplifier device with its specific category.
 */
export class Amplifier extends Device<AmplifierCategory> {}
