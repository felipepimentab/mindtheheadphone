import type { SoundSignature } from './soundSignatures';

export const deviceTypes = [
  'Earphone',
  'Headphone',
  'Eletrônico'
] as const;
export type DeviceType = typeof deviceTypes[number];

/**
 * Base abstraction for any audio device stored in the system.
 * Concrete devices (headphones, microphones, etc.) extend this class.
 */
export abstract class Device<T extends string = string> {
  constructor(
    /**
     * Human-readable product name.
     */
    readonly name: string,
    /**
     * URL-friendly identifier automatically derived from the device name.
     */
    readonly slug: string,
    /**
     * Indicates whether the product is imported (true) or domestic (false).
     */
    readonly imported: boolean,
    /**
     * Current market price in BRL.
     */
    readonly price: number,
    /**
     * Short marketing or technical description.
     */
    readonly overview: string,
    /**
     * Primary product image link.
     */
    readonly img: link,
    /**
     * Device-specific category (e.g., over-ear, dynamic, tube).
     */
    readonly category: T,
    /**
     * Additional tags for display.
     */
    readonly tags: string[],
    /**
     * Additional tags for display.
     */
    readonly type: DeviceType,
    /**
     * Device's Sound Signature
     */
    readonly signature?: SoundSignature,
    /**
     * Optional purchase link.
     */
    readonly buy?: link,
    /**
     * Optional review or article link.
     */
    readonly review?: link
  ) {}
}

export enum DeviceFormKeys {
  NAME = 'name',
  PRICE = 'price',
  IMAGE = 'image',
  IMPORTED = 'imported',
  CATEGORY = 'category',
  OVERVIEW = 'overview',
  REVIEW = 'review',
  BUY = 'buy',
  SIGNATURE = 'signature',
  TYPE = 'type',
  TAGS = 'tags'
}

export const DEVICES_FOLDER = 'devices';
