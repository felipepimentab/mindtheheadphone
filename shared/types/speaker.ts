import { Device } from './device';

/**
 * Speaker categories available in the system.
 */
export const speakerCategories = [
  'Caixa de som convencional',
  'Caixa de som Bluetooth'
] as const;

/**
 * Union type of valid speaker category keys.
 */
export type SpeakerCategory = typeof speakerCategories[number];

/**
 * Represents a speaker device with its specific category.
 */
export class Speaker extends Device<SpeakerCategory> {}
