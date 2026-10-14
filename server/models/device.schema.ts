import mongoose from 'mongoose';
import type { Device } from '~~/shared/types/device';

const schema = new mongoose.Schema<Device>({
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
  imported: {
    type: 'boolean',
    required: true,
    default: false
  },
  tags: {
    type: ['string'],
    required: false
  },
  type: {
    type: 'string',
    required: true
  },
  signature: {
    type: 'string',
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
}, {
  timestamps: true,
  bufferCommands: false,
  autoCreate: false
});

export const DeviceSchema = (mongoose.models.Device as mongoose.Model<Device> | undefined)
  || mongoose.model<Device>('Device', schema);
