import type { Headphone, HeadphoneCategory, SoundSignature } from '~~/shared/types/headphone';

interface FilterParams {
  min?: number
  max?: number
  search: string
  category: HeadphoneCategory[]
  signature: SoundSignature[]
};

type FilterStrategy = (filterParams: FilterParams, headphones: Headphone[]) => Headphone[];
type FilterChain = FilterStrategy[];

const filterByMin: FilterStrategy = (params, headphones) => {
  const { min = 0 } = params;
  return headphones.filter(hp => hp.price >= min);
};

const filterByMax: FilterStrategy = (params, headphones) => {
  const { max = 50000 } = params;
  return headphones.filter(hp => hp.price <= (max || 50000));
};

const filterByCategory: FilterStrategy = (params, headphones) => {
  const { category } = params;
  if (!category.length) return headphones;

  return headphones.filter(hp => category.includes(hp.category));
};

const filterBySignature: FilterStrategy = (params, headphones) => {
  const { signature } = params;
  if (!signature.length) return headphones;

  return headphones.filter(hp => signature.includes(hp.signature));
};

const filterBySearch: FilterStrategy = (params, headphones) => {
  const { search } = params;
  if (!search.trim()) return headphones;

  return headphones.filter(hp => normalizeString(hp.name).includes(normalizeString(search)));
};

export const useHeadphones = async () => {
  const filterChain: FilterChain = [filterByMin, filterByMax, filterByCategory, filterBySignature, filterBySearch];
  let headphones: Headphone[] = [];

  try {
    const response = await useFetch('/api/headphone');
    headphones = (response.data.value as Headphone[]) || [];
  } catch (error) {
    console.error('Failed to fetch headphones:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch headphones'
    });
  }

  function filteredHeadphones(filterParams: FilterParams): Headphone[] {
    let headphonesList = headphones;

    filterChain.forEach((filter) => {
      headphonesList = filter(filterParams, headphonesList);
    });

    return headphonesList;
  }

  return {
    filteredHeadphones
  };
};
