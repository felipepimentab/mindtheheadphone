import * as z from 'zod';
import { deviceTypes } from '~~/shared/types/device';

export const deviceFormSchema = z.object({
  type: z.enum(deviceTypes),
  name: z.string().min(1),
  price: z.number().min(MIN_PRICE).max(MAX_PRICE),
  imported: z.boolean(),
  overview: z.string().min(10),
  review: z.union([z.url(), z.literal('')]).optional(),
  buy: z.union([z.url(), z.literal('')]).optional(),
  tags: z.array(z.string()),
  image: z.instanceof(File),
  category: z.string(),
  signature: z.optional(z.string())
});
export type DeviceFormSchema = z.output<typeof deviceFormSchema>;

export const availableCategories = {
  Earphone: [...earphoneCategories],
  Headphone: [...headphoneCategories],
  Eletrônico: [...electronicCategories]
};
