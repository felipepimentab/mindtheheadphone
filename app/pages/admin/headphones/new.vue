<script lang="ts" setup>
import * as z from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';

const schema = z.object({
  name: z.string(),
  price: z.number().min(0),
  overview: z.string(),
  review: z.url(),
  buy: z.url(),
  image: z.file(),
  category: z.string(),
  signature: z.string()
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: '',
  price: 0,
  overview: '',
  review: '',
  buy: '',
  image: undefined,
  category: '',
  signature: ''
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const formData = new FormData();
  formData.append('name', event.data.name);
  formData.append('price', event.data.price.toString());
  formData.append('overview', event.data.overview);
  formData.append('review', event.data.review);
  formData.append('buy', event.data.buy);
  formData.append('image', event.data.image);
  formData.append('category', event.data.category);
  formData.append('signature', event.data.signature);
  try {
    await $fetch('/api/headphone/create', {
      method: 'POST',
      body: formData
    });
    toast.add({
      title: 'Sucesso',
      description: 'Fone cadastrado com sucesso!',
      color: 'success'
    });
  } catch (err) {
    console.error(err);
  }
}

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
            name="overview"
            size="xl"
          >
            <UTextarea
              v-model="state.overview"
              autoresize
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
              v-model="state.category as HeadphoneCategory"
              value-key="id"
              :items="[...headphoneCategories]"
              class="w-[200px]"
            />
          </UFormField>

          <UFormField
            label="Assinatura Sonora"
            name="signature"
            size="xl"
          >
            <USelect
              v-model="state.signature as SoundSignature"
              value-key="id"
              :items="[...soundSignatures]"
              class="w-[200px]"
            />
          </UFormField>

          <UFormField
            label="Imagem"
            name="image"
            size="xl"
          >
            <UFileUpload
              v-model="state.image"
              icon="i-lucide-image"
              label="Drop your image here"
              description="SVG, PNG, JPG or GIF (max. 2MB)"
              class="w-96 min-h-48"
            />
          </UFormField>

          <UButton
            type="submit"
          >
            Submit
          </UButton>
        </UForm>
      </div>
    </template>
  </UDashboardPanel>
</template>
