import { defineStore } from 'pinia';

interface Filters {
  order: string
  search: string
  category: string[]
  signature: string[]
  min: number
  max: number
}

export const useFiltersStore = defineStore('filters', () => {
  const search = ref('');
  const order = ref(DEFAULT_ORDER);
  const category = ref<string[]>([]);
  const signature = ref<string[]>([]);
  const min = ref(MIN_PRICE);
  const max = ref(MAX_PRICE);

  function setFilters(p: Filters) {
    search.value = p.search || '';
    category.value = p.category || [];
    signature.value = p.signature || [];
    min.value = p.min || MIN_PRICE;
    max.value = p.max || MAX_PRICE;
    order.value = p.order || DEFAULT_ORDER;
  }

  function clearFilters() {
    setFilters({
      search: '',
      category: [],
      signature: [],
      min: MIN_PRICE,
      max: MAX_PRICE,
      order: DEFAULT_ORDER
    });
  }

  return {
    search,
    order,
    category,
    signature,
    min,
    max,
    setFilters,
    clearFilters
  };
});
