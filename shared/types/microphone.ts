import { Device } from './device';

/**
 * Microphone categories available in the system.
 */
export const microphoneCategories = [
  'Microfone de estúdio',
  'Microfone de Telefone'
] as const;

/**
 * Union type of valid microphone category keys.
 */
export type MicrophoneCategory = typeof microphoneCategories[number];

/**
 * Represents a microphone device with its specific category.
 */
export class Microphone extends Device<MicrophoneCategory> {}
