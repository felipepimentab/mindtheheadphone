<script lang="ts" setup>
import type { Device } from '~~/shared/types/device';

definePageMeta({
  layout: 'dashboard'
});

type AdminDevice = Device & {
  _id?: string
  createdAt?: string
  updatedAt?: string
};

const { data: devices, error, pending, refresh } = await useFetch<AdminDevice[]>('/api/devices', {
  default: () => []
});

function getDeviceEditPath(device: AdminDevice) {
  return `/admin/${encodeURIComponent(String(device._id || device.slug))}`;
}

function formatBRL(amount: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount || 0);
}

function formatDate(date?: string) {
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
      <div class="flex h-full flex-col gap-4">
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

        <div
          v-else
          class="overflow-hidden rounded-lg border border-default"
        >
          <div class="overflow-x-auto">
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
                  v-for="device in devices"
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
                    {{ device.imported ? 'Importado' : 'Nacional' }}
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
