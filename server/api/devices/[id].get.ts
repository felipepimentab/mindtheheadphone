import { findDeviceOrThrow } from '~~/server/utils/devices';

export default defineEventHandler(async (event) => {
  const { id = '' } = event.context.params as { id?: string };

  return await findDeviceOrThrow(id);
});
