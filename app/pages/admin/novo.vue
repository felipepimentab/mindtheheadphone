<script lang="ts" setup>
import type { Receiver } from '~~/shared/types/receiver';

// import type { FormSubmitEvent } from '@nuxt/ui';

// const toast = useToast();
definePageMeta({
  layout: 'dashboard'
});

const deviceForm = ref();
const formValues = computed(() => {
  const values = { ...deviceForm?.value?.state };
  return values as DeviceFormSchema;
});

const device = computed<Partial<Receiver>>(() => {
  const imageUrl = formValues.value.image ? URL.createObjectURL(formValues.value.image) : '/image/headphones.png';
  const d: Partial<Receiver> = {
    name: formValues.value.name || 'Nome do dispositivo',
    imported: formValues.value.imported,
    price: formValues.value.price,
    overview: formValues.value.overview,
    category: formValues.value.category,
    signature: formValues.value.signature as SoundSignature,
    tags: formValues.value.tags,
    buy: formValues.value.buy,
    review: formValues.value.review,
    img: imageUrl,
    slug: 'slug'
  };
  return d;
});
</script>

<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar
        title="Adicionar novo dispositivo"
        icon="i-lucide-plus-circle"
      />
    </template>

    <template #body>
      <div class="lg:grid lg:grid-cols-[500px_auto] space-x-8">
        <DeviceForm
          ref="deviceForm"
        />
        <div>
          <DeviceCard
            :device="device"
            class="max-w-[450px] lg:sticky lg:top-0"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
