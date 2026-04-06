<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';

const toast = useToast();
const state = reactive<Partial<DeviceFormSchema>>({
  type: 'Earphone',
  name: '',
  price: 0,
  imported: false,
  overview: '',
  review: '',
  buy: '',
  tags: [],
  image: undefined,
  category: '',
  signature: ''
});

const types = [...deviceTypes];
const categories = computed<string[]>(() => {
  return availableCategories[state.type as DeviceType] || [];
});

function handleTypeChange() {
  state.category = '';
  state.signature = '';
}

function clearForm() {
  state.type = 'Earphone';
  state.name = '';
  state.price = 0;
  state.imported = false;
  state.overview = '';
  state.review = '';
  state.buy = '';
  state.tags = [];
  state.image = undefined;
  state.category = '';
  state.signature = '';
}

defineExpose({
  state,
  clearForm
});

async function onSubmit(event: FormSubmitEvent<DeviceFormSchema>) {
  const { handleSubmit } = useDeviceForm(event);

  try {
    await handleSubmit();
  } catch (error) {
    toast.add({
      title: 'Erro',
      description: error as string,
      color: 'error'
    });
    console.error(error);
  }
};

const FORM_STYLE = 'soft' as const;
</script>

<template>
  <UForm
    :schema="deviceFormSchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Tipo de dispositivo"
      name="category"
      size="xl"
      required
    >
      <USelect
        v-model="state.type"
        value-key="id"
        :items="[...types]"
        class="w-full"
        :variant="FORM_STYLE"
        @change="handleTypeChange"
      />
    </UFormField>
    <USeparator />
    <UFormField
      label="Nome"
      name="name"
      size="xl"
      class="w-full"
      required
    >
      <UInput
        v-model="state.name"
        class="w-full"
        :variant="FORM_STYLE"
      />
    </UFormField>
    <UFormField
      label="Descrição"
      name="overview"
      size="xl"
      class="w-full"
      required
    >
      <UTextarea
        v-model="state.overview"
        class="w-full"
        :variant="FORM_STYLE"
        autoresize
      />
    </UFormField>

    <UFormField
      label="Categoria"
      name="category"
      size="xl"
      class="w-full"
      required
    >
      <USelect
        v-model="state.category"
        value-key="id"
        :items="[...categories]"
        class="w-full"
        :variant="FORM_STYLE"
      />
    </UFormField>
    <UFormField
      v-if="state.type !== 'Eletrônico'"
      label="Assinatura Sonora"
      name="signature"
      size="xl"
      required
    >
      <USelect
        v-model="(state.signature as SoundSignature)"
        value-key="id"
        :items="[...soundSignatures]"
        class="w-full"
        :variant="FORM_STYLE"
      />
    </UFormField>
    <USeparator />
    <UFormField
      label="Preço final"
      name="price"
      size="xl"
      class="w-full"
      required
    >
      <UInput
        v-model="state.price"
        type="number"
        :variant="FORM_STYLE"
        class="w-full"
      />
    </UFormField>
    <UFormField
      name="imported"
      size="xl"
      class="w-full"
    >
      <UCheckbox
        v-model="state.imported"
        label="Importado"
        size="xl"
      />
    </UFormField>
    <USeparator />
    <UFormField
      label="Link para comprar"
      name="buy"
      size="xl"
      class="w-full"
    >
      <UInput
        v-model="state.buy"
        class="w-full"
        :variant="FORM_STYLE"
      />
    </UFormField>
    <UFormField
      label="Link para a Review"
      name="review"
      size="xl"
      class="w-full"
    >
      <UInput
        v-model="state.review"
        class="w-full"
        :variant="FORM_STYLE"
      />
    </UFormField>

    <UFormField
      label="Imagem"
      name="image"
      size="xl"
      class="w-full"
      required
    >
      <UFileUpload
        v-model="state.image"
        icon="i-lucide-image"
        label="Arraste a sua imagem aqui"
        description="PNG e JPG"
        class="h-40"
        variant="area"
        :interactive="true"
        layout="grid"
      />
    </UFormField>

    <div class="flex items-center justify-between">
      <UButton
        class="w-fit"
        :variant="FORM_STYLE"
        color="error"
        trailing-icon="i-lucide-eraser"
      >
        Limpar formulário
      </UButton>
      <UButton
        type="submit"
        class="w-fit"
        variant="soft"
        color="success"
        trailing-icon="i-lucide-circle-plus"
      >
        Adicionar
      </UButton>
    </div>
  </UForm>
</template>
