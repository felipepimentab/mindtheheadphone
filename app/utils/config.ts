import type { SelectItem } from '@nuxt/ui';

export const DEFAULT_ORDER = 'ascending';
export const MIN_RANGE = 0;
export const MAX_RANGE = 150;
export const MIN_PRICE = sliderToPrice(MIN_RANGE);
export const MAX_PRICE = sliderToPrice(MAX_RANGE);

export function sliderToPrice(v: number) {
  return Math.floor(Math.pow((v / 10), 4));
}

export function priceToSlider(price: number) {
  return Math.floor(Math.sqrt(Math.sqrt(price)) * 10);
}

export const orders = [
  {
    label: 'Menor preço',
    value: 'ascending',
    icon: 'i-lucide-arrow-down-narrow-wide'
  },
  {
    label: 'Maior preço',
    value: 'descending',
    icon: 'i-lucide-arrow-down-wide-narrow'
  },
  {
    label: 'Alfabética',
    value: 'alphabetic',
    icon: 'i-lucide-arrow-down-a-z'
  }
] satisfies SelectItem[];
