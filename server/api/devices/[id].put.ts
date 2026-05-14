import { createError } from 'h3';
import { requireAdmin } from '~~/server/utils/auth';
import { deleteDeviceImage, findDeviceOrThrow, parseDeviceForm, uploadDeviceImage } from '~~/server/utils/devices';

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const { id } = event.context.params as { id?: string };
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Device id is required'
    });
  }

  const form = await readMultipartFormData(event);
  if (!form) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Multipart form data is required'
    });
  }

  const device = await findDeviceOrThrow(id);
  const oldImageUrl = device.img;
  const { deviceData, image } = parseDeviceForm(form, { requireImage: false });

  if (image) {
    const imageSlug = deviceData.slug || device.slug;
    const { url } = await uploadDeviceImage(image, imageSlug);
    device.set('img', url);
  }

  device.set(deviceData);
  const updatedDevice = await device.save();

  if (image && oldImageUrl && oldImageUrl !== updatedDevice.img) {
    await deleteDeviceImage(oldImageUrl);
  }

  return updatedDevice;
});
