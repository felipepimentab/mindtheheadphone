import type { Device } from '~~/shared/types/device';

export async function useGetDevices(url: link) {
  const filterChain: FilterChain<Device> = [
    filterByMin,
    filterByMax,
    filterByCategory,
    filterBySearch,
    orderBy
  ];
  let devices: Device[] = [];

  try {
    const response = await useFetch(url);
    devices = (response.data.value as Device[]) || [];
  } catch (error) {
    console.error(error);
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
