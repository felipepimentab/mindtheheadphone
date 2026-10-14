import { runDatabaseOperation } from '~~/server/utils/database';
import { DeviceSchema } from '~~/server/models/device.schema';
import { resolveDeviceType } from '~~/server/utils/devices';

export default defineEventHandler(async (event) => {
  return await runDatabaseOperation(event, 'devices.list', async () => {
    const { type } = getQuery(event);
    const deviceType = resolveDeviceType(type as string | string[] | undefined);
    const query = deviceType ? { type: deviceType } : {};

    return await DeviceSchema.find(query).sort({ name: 1 });
  });
});
