<script lang="ts" setup>
import * as z from 'zod';
import type { FormSubmitEvent, SelectItem } from '@nuxt/ui';

const schema = z.object({
  name: z.string(),
  price: z.number().min(0),
  description: z.string(),
  review: z.url(),
  buy: z.url(),
  image: z.file()
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: '',
  price: 0,
  description: '',
  review: '',
  buy: '',
  image: undefined
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' });
  console.log(event.data);
}

const categories = ref<SelectItem[]>(['Intra-auricular', 'Earbud', 'Intra-auricular Bluetooth', 'Earbud Bluetooth', 'Headphone Cabeado', 'Headphone Bluetooth', 'Headphone Gamer']);
const signatures = ref<SelectItem[]>(['Enérgico', 'Natural', 'Neutro-Quente', 'Analítico', 'Seco/Direto', 'Neutro-Frio', 'Musical', 'Basshead', 'V-Shaped Forte']);

const category = ref();
const signature = ref();

definePageMeta({
  layout: 'dashboard'
});
</script>

<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar
        title="Headphones e Earphones"
        icon="i-lucide-headphones"
      />
      <!-- <UDashboardToolbar /> -->
    </template>

    <template #body>
      <div class="form">
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField
            label="Nome"
            name="name"
            size="xl"
          >
            <UInput v-model="state.name" />
          </UFormField>
          <UFormField
            label="Preço"
            name="price"
            size="xl"
          >
            <UInput
              v-model="state.price"
              type="number"
            />
          </UFormField>
          <UFormField
            label="Descrição"
            name="description"
            size="xl"
          >
            <UInput
              v-model="state.description"
              type="text"
            />
          </UFormField>
          <UFormField
            label="Comprar"
            name="buy"
            size="xl"
          >
            <UInput v-model="state.buy" />
          </UFormField>
          <UFormField
            label="Review"
            name="review"
            size="xl"
          >
            <UInput v-model="state.review" />
          </UFormField>

          <UFormField
            label="Categoria"
            name="category"
            size="xl"
          >
            <USelect
              v-model="category"
              value-key="id"
              :items="categories"
              class="w-[200px]"
            />
          </UFormField>

          <UFormField
            label="Assinatura Sonora"
            name="signature"
            size="xl"
          >
            <USelect
              v-model="signature"
              value-key="id"
              :items="signatures"
              class="w-[200px]"
            />
          </UFormField>

          <UFormField
            label="Imagem"
            name="image"
            size="xl"
          >
            <UFileUpload
              icon="i-lucide-image"
              label="Drop your image here"
              description="SVG, PNG, JPG or GIF (max. 2MB)"
              class="w-96 min-h-48"
            />
          </UFormField>

          <UButton type="submit">
            Submit
          </UButton>
        </UForm>
      </div>
    </template>
  </UDashboardPanel>
</template>
