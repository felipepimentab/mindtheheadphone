import mongoose from 'mongoose';
import { useRuntimeConfig } from 'nitropack/runtime';
import { createMongoConnectionManager } from './mongoConnection';

const database = createMongoConnectionManager({
  client: {
    connection: mongoose.connection,
    connect: (uri, options) => mongoose.connect(uri, options),
    disconnect: () => mongoose.disconnect(),
    probe: () => mongoose.connection.getClient().db().command({ ping: 1 }, { timeoutMS: 5_000 })
  },
  // Keep the existing deployment variable and resolve it at runtime, not build time.
  getUri: () => process.env.DB_MONGODB_URI ?? useRuntimeConfig().mongodbUri,
  log: (level, entry) => console[level](JSON.stringify(entry))
});

export const runDatabaseOperation = database.run;
