import { defineMongooseModel } from '#nuxt/mongoose';

export const ElectronicSchema = defineMongooseModel<Electronic>({
  name: 'Electronic',
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
