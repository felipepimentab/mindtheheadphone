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
  const order = ref('ascending');
  const category = ref<string[]>([]);
  const signature = ref<string[]>([]);
  const min = ref(0);
  const max = ref(50625);

  function setFilters(p: Filters) {
    search.value = p.search || '';
    category.value = p.category || [];
    signature.value = p.signature || [];
    min.value = p.min || 0;
    max.value = p.max || 50625;
    order.value = p.order || 'ascending';
  }

  function clearFilters() {
    setFilters({
      search: '',
      category: [],
      signature: [],
      min: 0,
      max: 50625,
      order: 'ascending'
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
