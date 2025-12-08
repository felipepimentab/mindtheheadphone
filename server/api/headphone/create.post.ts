import { put } from '@vercel/blob';
import { createError } from 'h3';

// interface RequestBody {
//   name: string
//   price: number
//   overview: string
//   review: link
//   buy: link
//   image: File
//   category: string
//   signature: string
// }

const FOLDER = 'headphones';

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  if (!form) {
    return createError({
      statusCode: 400,
      statusMessage: 'Missing form'
    });
  }
  const { getString, getNumber, getFile } = parseForm(form as MPD[]);

  const name = getString('name') as string;
  if (!name) {
    return createError({
      statusCode: 400,
      statusMessage: 'Campo "Nome" inválido'
    });
  }
  const slug = createSlugWithLimit(name);

  const price = getNumber('price') as number;
  if (!price) {
    return createError({
      statusCode: 400,
      statusMessage: 'Campo "Preço" inválido'
    });
  }

  const overview = getString('overview') as string;
  if (!overview) {
    return createError({
      statusCode: 400,
      statusMessage: 'Campo "Descrição" inválido'
    });
  }

  const review = getString('review') as string;
  if (!review) {
    return createError({
      statusCode: 400,
      statusMessage: 'Campo "Review" inválido'
    });
  }

  const buy = getString('buy') as string;
  if (!buy) {
    return createError({
      statusCode: 400,
      statusMessage: 'Campo "Comprar" inválido'
    });
  }

  const category = getString('category') as string;
  if (!category) {
    return createError({
      statusCode: 400,
      statusMessage: 'Campo "Categoria" inválido'
    });
  }

  const signature = getString('signature') as string;
  if (!signature) {
    return createError({
      statusCode: 400,
      statusMessage: 'Campo "Assinatura Sonora" inválido'
    });
  }

  const image = getFile('image') as MPD;
  if (!image) {
    return createError({
      statusCode: 400,
      statusMessage: 'Campo "Imagem" inválido'
    });
  }

  if (!image.type?.startsWith('image/')) {
    return;
  }
  const imageType = image.type.split('/')[1];

  console.log(`${FOLDER}/${slug}.${imageType}`);

  const { url } = await put(`${FOLDER}/${slug}.${imageType}`, image.data, { access: 'public' });

  console.log(url);

  const hp = new HeadphoneSchema({
    name,
    price,
    overview,
    review,
    buy,
    slug,
    img: url,
    category,
    signature
  });

  await hp.save();

  // await new HeadphoneSchema({
  //   ...body,
  //   slug,
  //   img: url
  // }).save();
});

interface MPD {
  name: string
  data: Buffer
  filename?: string
  type?: string
}

function parseForm(form: MPD[]) {
  function getString(n: string) {
    return form.find(field => field.name === n)?.data.toString();
  }

  function getNumber(n: string) {
    const s = form.find(field => field.name === n)?.data.toString();
    if (s) {
      return parseInt(s);
    }
    return s;
  }

  function getFile(n: string) {
    return form.find(field => field.name === n);
  }

  return {
    getString,
    getNumber,
    getFile
  };
};
