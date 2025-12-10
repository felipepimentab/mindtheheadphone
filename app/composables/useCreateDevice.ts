import type { MultiPartData } from 'h3';

export function useCreateDevice(form: MultiPartData[]) {
  const { getString, getNumber, getFile } = useParseForm(form);

  const name = getString('name');
  if (!name) {
    throw new Error('Name is missing');
  }

  const price = getNumber('price');
  if (!price) {
    throw new Error('Price is missing');
  }

  const overview = getString('overview');
  if (!overview) {
    throw new Error('Overview is missing');
  }

  const review = getString('review');
  if (!review) {
    throw new Error('Review link is missing');
  }

  const buy = getString('buy');
  if (!buy) {
    throw new Error('Buy link is missing');
  }

  const category = getString('category');
  if (!category) {
    throw new Error('Category link is missing');
  }

  const slug = createSlugWithLimit(name);

  const image = getFile('image');
  if (!image) {
    throw new Error('Image is missing');
  }
  if (!image.type?.startsWith('image/')) {
    throw new Error('File is not an image');
  }
  const imageType = image.type.split('/')[1];

  const imagePath = (folder: string) => `${folder}/${slug}.${imageType}`;
  const imageData = image.data;

  return {
    name,
    price,
    overview,
    review,
    buy,
    category,
    slug,
    imagePath,
    imageData
  };
};
