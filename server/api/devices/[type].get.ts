import type { DeviceType } from '~~/shared/types/device';

export default defineEventHandler(async (event) => {
  const { type = '' } = event.context.params as { type?: string };
  if (Ktype.includes(type)) {
    return await DeviceSchema.find({ type: Itype[type] });
  }
  return await DeviceSchema.find();
});

const Itype: Record<string, DeviceType> = {
  electronics: 'Eletrônico',
  earphones: 'Earphone',
  headphones: 'Headphone'
} as const;
const Ktype = Object.keys(Itype);
