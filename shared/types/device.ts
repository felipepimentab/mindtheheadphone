import { createSlugWithLimit } from '../utils/createSlug';

/**
 * Base abstraction for any audio device stored in the system.
 * Concrete devices (headphones, microphones, etc.) extend this class.
 */
export abstract class Device<T extends string> {
  /**
   * URL-friendly identifier automatically derived from the device name.
   */
  readonly slug: string;

  constructor(
    /**
     * Human-readable product name.
     */
    readonly name: string,
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
     * Searchable keywords (e.g., “portable”, “gaming”, “studio”).
     */
    readonly tags: string[],
    /**
     * Optional purchase link.
     */
    readonly buy?: link,
    /**
     * Optional review or article link.
     */
    readonly review?: link
  ) {
    this.slug = createSlugWithLimit(name);
  }
}
