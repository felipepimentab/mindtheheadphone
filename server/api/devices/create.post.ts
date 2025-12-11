import { put } from '@vercel/blob';
// import { createError } from 'h3';
import { DeviceSchema } from '~~/server/models/device.schema';
import { useCreateDevice } from '~/composables/useCreateDevice';

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  if (!form) {
    return;
  }

  try {
    const { deviceData, imagePath, imageData } = useCreateDevice(form);
    const { url } = await put(imagePath, imageData, { access: 'public' });
    const newDevice = new DeviceSchema({
      ...deviceData,
      img: url
    });
    newDevice.save();
  } catch (error) {
    console.error(error);
  }
});
