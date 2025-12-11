import * as z from 'zod';

export const availableTypes = [
  'Earphone',
  'Headphone',
  'Eletrônico'
] as const;
export type AvailableType = typeof availableTypes[number];

export const deviceFormSchema = z.object({
  type: z.enum(availableTypes),
  name: z.string().min(1),
  price: z.number().min(MIN_PRICE).max(MAX_PRICE),
  imported: z.boolean(),
  overview: z.string().min(10),
  review: z.url(),
  buy: z.url(),
  tags: z.array(z.string()),
  image: z.instanceof(File),
  category: z.string(),
  signature: z.string().optional()
});
export type DeviceFormSchema = z.output<typeof deviceFormSchema>;

export const availableCategories = {
  Earphone: [...earphoneCategories],
  Headphone: [...headphoneCategories],
  Eletrônico: [...electronicCategories]
};
