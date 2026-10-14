<script lang="ts" setup>
import type { Device } from '~~/shared/types/device';
import { deviceTypes } from '~~/shared/types/device';
import { soundSignatures } from '~~/shared/types/soundSignatures';
import { adminDeviceCategories, adminPriceRanges, createAdminDeviceFilters, filterAdminDevices } from '~/utils/adminDeviceFilters';

definePageMeta({
  layout: 'dashboard'
});

const { data: devices, error, pending, refresh } = await useFetch<Device[]>('/api/devices', {
  default: () => []
});

const filters = reactive(createAdminDeviceFilters());
const filteredDevices = computed(() => filterAdminDevices(devices.value, filters));
const hasActiveFilters = computed(() => filters.search.trim() !== '' || Object.entries(filters).some(([key, value]) => key !== 'search' && value !== 'all'));

function options(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'pt-BR')).map(value => ({ label: value, value }));
}

const typeOptions = computed(() => [
  { label: 'Todos os tipos', value: 'all' },
  ...options([...deviceTypes, ...devices.value.map(device => device.type)])
]);
const categoryOptions = computed(() => [
  { label: 'Todas as categorias', value: 'all' },
  ...options([
    ...deviceTypes.flatMap(type => filters.type === 'all' || filters.type === type ? adminDeviceCategories[type] : []),
    ...devices.value.filter(device => filters.type === 'all' || device.type === filters.type).map(device => device.category).filter(Boolean)
  ]),
  { label: 'Sem categoria', value: '__missing__' }
]);
const signatureOptions = computed(() => [
  { label: 'Todas as assinaturas', value: 'all' },
  ...options([...soundSignatures, ...devices.value.flatMap(device => device.signature ? [device.signature] : [])]),
  { label: 'Sem assinatura', value: '__missing__' }
]);
const tagOptions = computed(() => [
  { label: 'Todas as tags', value: 'all' },
  ...options(devices.value.flatMap(device => device.tags || [])),
  { label: 'Sem tags', value: '__missing__' }
]);
const reviewOptions = [
  { label: 'Todos os dispositivos', value: 'all' },
  { label: 'Com review', value: 'with' },
  { label: 'Sem review', value: 'without' }
];
const buyOptions = [
  { label: 'Todos os dispositivos', value: 'all' },
  { label: 'Com link de compra', value: 'with' },
  { label: 'Sem link de compra', value: 'without' }
];
const originOptions = [
  { label: 'Todas as origens', value: 'all' },
  { label: 'Importado', value: 'imported' },
  { label: 'Nacional', value: 'domestic' },
  { label: 'Não informado', value: 'unknown' }
];

watch(() => filters.type, () => {
  if (!categoryOptions.value.some(option => option.value === filters.category)) filters.category = 'all';
});

function resetFilters() {
  Object.assign(filters, createAdminDeviceFilters());
}

function getDeviceEditPath(device: Device) {
  return `/admin/${encodeURIComponent(String(device._id || device.slug))}`;
}

function formatBRL(amount: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount || 0);
}

function formatDate(date?: Date | string) {
  if (!date) return '-';

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(date));
}
</script>

<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar
        title="Todos os dispositivos"
        icon="i-lucide-headphones"
      >
        <template #right>
          <UButton
            to="/admin/novo"
            icon="i-lucide-plus"
            color="primary"
            variant="soft"
          >
            Adicionar
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h1 class="text-xl font-semibold text-highlighted">
              Dispositivos cadastrados
            </h1>
            <p class="text-sm text-muted">
              {{ devices.length }} dispositivo{{ devices.length === 1 ? '' : 's' }} no banco de dados
            </p>
          </div>

          <UButton
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="ghost"
            :loading="pending"
            aria-label="Atualizar lista"
            @click="refresh()"
          />
        </div>

        <div
          v-if="devices.length"
          class="flex flex-col gap-3"
        >
          <UFormField
            label="Buscar dispositivos"
            class="w-full"
          >
            <UInput
              v-model="filters.search"
              icon="i-lucide-search"
              placeholder="Nome, slug, descrição ou tag..."
              class="w-full"
            >
              <template #trailing>
                <UButton
                  v-if="filters.search"
                  icon="i-lucide-x"
                  color="neutral"
                  variant="link"
                  size="xs"
                  aria-label="Limpar busca"
                  @click="filters.search = ''"
                />
              </template>
            </UInput>
          </UFormField>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <UFormField label="Tipo">
              <USelect
                v-model="filters.type"
                :items="typeOptions"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Categoria">
              <USelect
                v-model="filters.category"
                :items="categoryOptions"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Assinatura sonora">
              <USelect
                v-model="filters.signature"
                :items="signatureOptions"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Faixa de preço">
              <USelect
                v-model="filters.price"
                :items="[...adminPriceRanges]"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Tag">
              <USelect
                v-model="filters.tag"
                :items="tagOptions"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Review">
              <USelect
                v-model="filters.review"
                :items="reviewOptions"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Origem">
              <USelect
                v-model="filters.origin"
                :items="originOptions"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Link de compra">
              <USelect
                v-model="filters.buy"
                :items="buyOptions"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="flex items-center justify-between gap-3">
            <p
              class="text-sm text-muted"
              role="status"
              aria-live="polite"
            >
              {{ filteredDevices.length }} de {{ devices.length }} dispositivo{{ devices.length === 1 ? '' : 's' }}
            </p>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-filter-x"
              :disabled="!hasActiveFilters"
              @click="resetFilters"
            >
              Limpar filtros
            </UButton>
          </div>
        </div>

        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          icon="i-lucide-circle-alert"
          title="Não foi possível carregar os dispositivos"
          :description="error.message"
        />

        <div
          v-else-if="pending"
          class="flex flex-col gap-2"
        >
          <USkeleton
            v-for="item in 6"
            :key="item"
            class="h-24 w-full rounded-lg"
          />
        </div>

        <UEmpty
          v-else-if="!devices.length"
          variant="soft"
          icon="i-lucide-database"
          title="Nenhum dispositivo cadastrado"
          description="Os dispositivos adicionados ao banco de dados aparecerão aqui."
          size="xl"
        >
          <template #actions>
            <UButton
              to="/admin/novo"
              icon="i-lucide-plus"
              variant="soft"
            >
              Adicionar dispositivo
            </UButton>
          </template>
        </UEmpty>

        <UEmpty
          v-else-if="!filteredDevices.length"
          variant="soft"
          icon="i-lucide-search"
          title="Nenhum dispositivo encontrado"
          description="Tente outra busca ou ajuste os filtros."
          size="xl"
        >
          <template #actions>
            <UButton
              color="neutral"
              variant="soft"
              @click="resetFilters"
            >
              Limpar filtros
            </UButton>
          </template>
        </UEmpty>

        <div
          v-else
          class="shrink-0 overflow-hidden rounded-lg border border-default"
        >
          <div class="max-h-[60dvh] overflow-auto">
            <table class="w-full min-w-[960px] divide-y divide-default text-sm">
              <thead class="bg-muted/40">
                <tr class="text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  <th class="px-4 py-3">
                    Dispositivo
                  </th>
                  <th class="px-4 py-3">
                    Tipo
                  </th>
                  <th class="px-4 py-3">
                    Categoria
                  </th>
                  <th class="px-4 py-3 text-right">
                    Preço
                  </th>
                  <th class="px-4 py-3">
                    Origem
                  </th>
                  <th class="px-4 py-3">
                    Atualizado em
                  </th>
                  <th class="px-4 py-3 text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-default">
                <tr
                  v-for="device in filteredDevices"
                  :key="device._id || device.slug || device.name"
                  class="hover:bg-muted/30"
                >
                  <td class="px-4 py-3">
                    <NuxtLink
                      :to="getDeviceEditPath(device)"
                      class="flex items-center gap-3"
                    >
                      <NuxtImg
                        :src="device.img"
                        :alt="device.name"
                        width="48"
                        height="48"
                        densities="x1 x2"
                        quality="80"
                        class="size-12 rounded-md bg-white object-cover"
                        loading="lazy"
                      />
                      <div class="min-w-0">
                        <p class="truncate font-medium text-highlighted">
                          {{ device.name }}
                        </p>
                        <p class="truncate text-xs text-muted">
                          {{ device.slug }}
                        </p>
                      </div>
                    </NuxtLink>
                  </td>
                  <td class="px-4 py-3">
                    <UBadge
                      color="neutral"
                      variant="soft"
                    >
                      {{ device.type }}
                    </UBadge>
                  </td>
                  <td class="px-4 py-3 text-muted">
                    {{ device.category || '-' }}
                  </td>
                  <td class="px-4 py-3 text-right font-medium">
                    {{ formatBRL(device.price) }}
                  </td>
                  <td class="px-4 py-3 text-muted">
                    {{ device.imported === true ? 'Importado' : device.imported === false ? 'Nacional' : 'Não informado' }}
                  </td>
                  <td class="px-4 py-3 text-muted">
                    {{ formatDate(device.updatedAt) }}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <UButton
                      :to="getDeviceEditPath(device)"
                      icon="i-lucide-pencil"
                      color="neutral"
                      variant="ghost"
                      size="xs"
                      aria-label="Editar dispositivo"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
