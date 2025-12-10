import type { Receiver } from '~~/shared/types/receiver';

export async function useGetDevices(url: link) {
  const filterChain: FilterChain = [
    filterByMin,
    filterByMax,
    filterByCategory,
    filterBySignature,
    filterBySearch,
    orderBy
  ];
  let devices: Receiver[] = [];

  try {
    const response = await useFetch(url);
    devices = (response.data.value as Receiver[]) || [];
  } catch (error) {
    console.error(error);
  }

  function getDevices(params: FilterParams): Receiver[] {
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
