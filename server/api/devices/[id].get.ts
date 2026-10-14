import { runDatabaseOperation } from '~~/server/utils/database';
import { findDeviceOrThrow } from '~~/server/utils/devices';

export default defineEventHandler(async (event) => {
  return await runDatabaseOperation(event, 'devices.get', async () => {
    const { id = '' } = event.context.params as { id?: string };

    return await findDeviceOrThrow(id);
  });
});
