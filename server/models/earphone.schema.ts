import { defineMongooseModel } from '#nuxt/mongoose';

export const EarphoneSchema = defineMongooseModel<Earphone>({
  name: 'Earphone',
  schema: {
    name: {
      type: 'string',
      required: true,
      unique: true
    },
    slug: {
      type: 'string',
      required: true,
      unique: true
    },
    img: {
      type: 'string',
      required: true
    },
    tags: {
      type: ['string'],
      required: false
    },
    signature: {
      type: 'string',
      required: true
    },
    category: {
      type: 'string',
      required: true
    },
    price: {
      type: 'number',
      required: true
    },
    overview: {
      type: 'string',
      required: false
    },
    buy: {
      type: 'string',
      required: false
    },
    review: {
      type: 'string',
      required: false
    }
  }
});
