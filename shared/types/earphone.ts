import { Receiver } from './receiver';

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
export class Earphone extends Receiver<EarphoneCategory> {}
