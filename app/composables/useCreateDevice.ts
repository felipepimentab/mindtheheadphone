import type { MultiPartData } from 'h3';
import { useParseForm } from '~/composables/useParseForm';

export function useCreateDevice(form: MultiPartData[]) {
  const { getString, getNumber, getFile, getArray, getBoolean } = useParseForm(form);

  const name = getString(DeviceFormKeys.NAME);
  const price = getNumber(DeviceFormKeys.PRICE);
  const overview = getString(DeviceFormKeys.OVERVIEW);
  const review = getString(DeviceFormKeys.REVIEW);
  const buy = getString(DeviceFormKeys.BUY);
  const category = getString(DeviceFormKeys.CATEGORY);
  const type = getString(DeviceFormKeys.TYPE);
  const image = getFile(DeviceFormKeys.IMAGE);
  const imported = getBoolean(DeviceFormKeys.IMPORTED);
  const tags = getArray(DeviceFormKeys.TAGS);
  const signature = getString(DeviceFormKeys.SIGNATURE);
  const slug = createSlugWithLimit(name || '');
  const deviceData = {
    name,
    price,
    overview,
    review,
    buy,
    category,
    imported,
    tags,
    signature,
    slug,
    type
  };

  if (!image?.type?.startsWith('image/')) {
    throw new Error('File is not an image');
  }
  const imageType = image.type.split('/')[1];
  const imagePath = `${DEVICES_FOLDER}/${slug}.${imageType}`;
  const imageData = image.data;

  return {
    deviceData,
    imagePath,
    imageData
  };
};
