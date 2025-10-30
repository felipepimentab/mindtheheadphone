import { defineMongooseModel } from '#nuxt/mongoose';
// import { Types } from 'mongoose';
import type { Headphone } from '~~/shared/types/headphone';

export const HeadphoneSchema = defineMongooseModel<Headphone>({
  name: 'Headphone',
  schema: {
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    img: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      required: false
    },
    signature: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    overview: {
      type: String,
      required: false
    },
    buy: {
      type: String,
      required: false
    },
    review: {
      type: String,
      required: false
    }
  }
});
