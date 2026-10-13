import { createError } from 'h3';
import { requireAdmin } from '~~/server/utils/auth';
import { parseDeviceForm, throwDeviceWriteError } from '~~/server/utils/deviceValidation';
import { deleteDeviceImage, findDeviceOrThrow, uploadDeviceImage } from '~~/server/utils/devices';
import { readDeviceMultipart } from '~~/server/utils/deviceMultipart';

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const { id } = event.context.params as { id?: string };
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Device id is required'
    });
  }

  const form = await readDeviceMultipart(event);

  const device = await findDeviceOrThrow(id);
  const oldImageUrl = device.img;
  const { deviceData, image } = parseDeviceForm(form, { requireImage: false, existing: device });

  if (image) {
    const imageSlug = deviceData.slug || device.slug;
    const { url } = await uploadDeviceImage(image, imageSlug);
    device.set('img', url);
  }

  device.set(deviceData);
  let updatedDevice;
  try {
    updatedDevice = await device.save();
  } catch (error) {
    throwDeviceWriteError(error);
  }

  if (image && oldImageUrl && oldImageUrl !== updatedDevice.img) {
    await deleteDeviceImage(oldImageUrl);
  }

  return updatedDevice;
});
