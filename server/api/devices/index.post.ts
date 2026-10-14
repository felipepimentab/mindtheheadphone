import { createError } from 'h3';
import { DeviceSchema } from '~~/server/models/device.schema';
import { requireAdmin } from '~~/server/utils/auth';
import { parseDeviceForm, throwDeviceWriteError } from '~~/server/utils/deviceValidation';
import { uploadDeviceImage } from '~~/server/utils/devices';
import { readDeviceMultipart } from '~~/server/utils/deviceMultipart';
import { cleanupDeviceImage } from '~~/server/utils/deviceImageCleanup';
import { revalidateRecommendations } from '~~/server/utils/revalidateRecommendations';

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const form = await readDeviceMultipart(event);

  const { deviceData, image } = parseDeviceForm(form, { requireImage: true });
  if (!deviceData.slug || !image) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Device name and image are required'
    });
  }

  const { url } = await uploadDeviceImage(image, deviceData.slug);
  let createdDevice;
  try {
    createdDevice = await DeviceSchema.create({
      ...deviceData,
      img: url
    });
  } catch (error) {
    await cleanupDeviceImage(url);
    throwDeviceWriteError(error);
  }

  await revalidateRecommendations();
  return createdDevice;
});
