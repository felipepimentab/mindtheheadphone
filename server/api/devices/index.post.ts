import { createError } from 'h3';
import { DeviceSchema } from '~~/server/models/device.schema';
import { parseDeviceForm, uploadDeviceImage } from '~~/server/utils/devices';

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  if (!form) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Multipart form data is required'
    });
  }

  const { deviceData, image } = parseDeviceForm(form, { requireImage: true });
  if (!deviceData.slug || !image) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Device name and image are required'
    });
  }

  const { url } = await uploadDeviceImage(image, deviceData.slug);
  const device = await DeviceSchema.create({
    ...deviceData,
    img: url
  });

  return device;
});
