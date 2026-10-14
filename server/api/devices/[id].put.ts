import { runDatabaseOperation } from '~~/server/utils/database';
import { createError } from 'h3';
import { requireAdmin } from '~~/server/utils/auth';
import { parseDeviceForm, throwDeviceWriteError } from '~~/server/utils/deviceValidation';
import { findDeviceOrThrow, uploadDeviceImage } from '~~/server/utils/devices';
import { readDeviceMultipart } from '~~/server/utils/deviceMultipart';
import { cleanupDeviceImage } from '~~/server/utils/deviceImageCleanup';
import { revalidateRecommendations } from '~~/server/utils/revalidateRecommendations';

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const { id } = event.context.params as { id?: string };
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Device id is required'
    });
  }

  return await runDatabaseOperation(event, 'devices.update', async () => {
    const form = await readDeviceMultipart(event);

    const device = await findDeviceOrThrow(id);
    const oldImageUrl = device.img;
    const { deviceData, image } = parseDeviceForm(form, { requireImage: false, existing: device });

    let uploadedImageUrl: string | undefined;
    if (image) {
      const imageSlug = deviceData.slug || device.slug;
      const { url } = await uploadDeviceImage(image, imageSlug);
      uploadedImageUrl = url;
      device.set('img', url);
    }

    device.set(deviceData);
    let updatedDevice;
    try {
      updatedDevice = await device.save();
    } catch (error) {
      await cleanupDeviceImage(uploadedImageUrl);
      throwDeviceWriteError(error);
    }

    await revalidateRecommendations();

    if (image && oldImageUrl && oldImageUrl !== updatedDevice.img) {
      await cleanupDeviceImage(oldImageUrl);
    }

    return updatedDevice;
  });
});
