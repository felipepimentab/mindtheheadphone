import { Device } from './device';
import type { SoundSignature } from './soundSignatures';

/**
 * Base for any device meant for personal listening (headphones, earphones).
 * Adds sound-signature on top of Device.
 */
export abstract class Receiver<T extends string = string> extends Device<T> {
  constructor(
    name: string,
    img: link,
    imported: boolean,
    price: number,
    overview: string,
    /**
     * Tonal character of the device.
     */
    readonly signature: SoundSignature,
    category: T,
    tags: string[],
    buy?: link,
    review?: link
  ) {
    super(name, imported, price, overview, img, category, tags, buy, review);
  }
}
