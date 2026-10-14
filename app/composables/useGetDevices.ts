import type { Device } from '~~/shared/types/device';
import { getCatalogDevices } from '~~/shared/utils/catalogResponse';

export async function useGetDevices(url: link) {
  const filterChain: FilterChain = [
    filterByMin,
    filterByMax,
    filterByCategory,
    filterBySignature,
    filterBySearch,
    orderBy
  ];
  const response = await useFetch<Device[]>(url);
  let devices: Device[];
  try {
    devices = getCatalogDevices(response.data.value, response.error.value);
  } catch (error) {
    // Nuxt's client error page requires a marked, fatal Nuxt error.
    const catalogError = createError(error as Error);
    catalogError.fatal = true;
    throw catalogError;
  }

  function getDevices(params: FilterParams): Device[] {
    let devicesList = devices;

    filterChain.forEach((filter) => {
      devicesList = filter(params, devicesList);
    });

    return devicesList;
  }

  return {
    getDevices
  };
};
