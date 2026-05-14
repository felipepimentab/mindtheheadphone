import { createError } from 'h3';
import { requireAdmin } from '~~/server/utils/auth';
import { deleteDeviceImage, findDeviceOrThrow } from '~~/server/utils/devices';

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const { id } = event.context.params as { id?: string };
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Device id is required'
    });
  }

  const device = await findDeviceOrThrow(id);
  const imageUrl = device.img;
  await device.deleteOne();
  await deleteDeviceImage(imageUrl);

  return {
    deleted: true,
    id
  };
});
