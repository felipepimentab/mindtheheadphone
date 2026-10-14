<script lang="ts" setup>
import type { Device, DeviceType } from '~~/shared/types/device';
import type { SoundSignature } from '~~/shared/types/soundSignatures';
import { createSlug } from '~~/shared/utils/createSlug';
import { DEVICE_IMAGE_MIME_TYPES } from '~~/shared/utils/deviceImage';

definePageMeta({
  layout: 'dashboard'
});

type DeviceCreateState = {
  type: DeviceType
  name: string
  price: number
  imported: boolean
  overview: string
  review: string
  buy: string
  tagsText: string
  image?: File
  category: string
  signature: string
};

const router = useRouter();
const toast = useToast();
const state = reactive<DeviceCreateState>({
  type: 'Earphone',
  name: '',
  price: 0,
  imported: false,
  overview: '',
  review: '',
  buy: '',
  tagsText: '',
  image: undefined,
  category: '',
  signature: ''
});
const saving = ref(false);
const imagePreview = computed(() => {
  if (state.image) return URL.createObjectURL(state.image);
  return '/image/headphones.png';
});
const categories = computed<string[]>(() => {
  return availableCategories[state.type] || [];
});
const previewDevice = computed<Partial<Device>>(() => {
  return {
    name: state.name || 'Nome do dispositivo',
    imported: state.imported,
    price: state.price,
    overview: state.overview,
    category: state.category,
    signature: state.signature as SoundSignature,
    tags: getTags(),
    buy: state.buy,
    review: state.review,
    img: imagePreview.value,
    slug: state.name ? createSlug(state.name) : 'slug',
    type: state.type
  };
});

function handleTypeChange() {
  state.category = '';
  state.signature = '';
}

function getTags() {
  return state.tagsText
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
}

function buildFormData() {
  const formData = new FormData();

  formData.append(DeviceFormKeys.TYPE, state.type);
  formData.append(DeviceFormKeys.NAME, state.name);
  formData.append(DeviceFormKeys.PRICE, state.price.toString());
  formData.append(DeviceFormKeys.IMPORTED, state.imported ? '1' : '0');
  formData.append(DeviceFormKeys.CATEGORY, state.category);
  formData.append(DeviceFormKeys.OVERVIEW, state.overview);
  formData.append(DeviceFormKeys.BUY, state.buy);
  formData.append(DeviceFormKeys.REVIEW, state.review);
  if (state.signature) {
    formData.append(DeviceFormKeys.SIGNATURE, state.signature);
  }
  if (state.image) {
    formData.append(DeviceFormKeys.IMAGE, state.image);
  }
  getTags().forEach((tag, index) => {
    formData.append(`${DeviceFormKeys.TAGS}[${index}]`, tag);
  });

  return formData;
}

function validateDevice() {
  if (!state.name.trim()) return 'Informe o nome do dispositivo.';
  if (!state.category) return 'Selecione uma categoria.';
  if (!state.overview.trim()) return 'Informe a descrição do dispositivo.';
  if (!state.image) return 'Selecione uma imagem.';
  if ((state.type === 'Earphone' || state.type === 'Headphone') && !state.signature) {
    return 'Headphones e Earphones precisam ter uma assinatura sonora.';
  }

  return '';
}

async function createDevice() {
  const validationError = validateDevice();
  if (validationError) {
    toast.add({
      title: 'Revise o cadastro',
      description: validationError,
      color: 'error'
    });
    return;
  }

  saving.value = true;

  try {
    await $fetch('/api/devices', {
      method: 'POST',
      body: buildFormData()
    });
    toast.add({
      title: 'Dispositivo criado',
      color: 'success'
    });
    await router.push('/admin');
  } catch (createError) {
    toast.add({
      title: 'Erro ao criar',
      description: createError instanceof Error ? createError.message : 'Não foi possível criar o dispositivo.',
      color: 'error'
    });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar
        title="Adicionar novo dispositivo"
        icon="i-lucide-plus-circle"
      >
        <template #left>
          <UButton
            to="/admin"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            aria-label="Voltar"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="grid gap-6 lg:grid-cols-[minmax(0,560px)_minmax(320px,1fr)]">
        <UForm
          :state="state"
          class="space-y-4"
          @submit.prevent="createDevice"
        >
          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField
              label="Tipo de dispositivo"
              name="type"
              required
            >
              <USelect
                v-model="state.type"
                :items="[...deviceTypes]"
                class="w-full"
                @change="handleTypeChange"
              />
            </UFormField>

            <UFormField
              label="Categoria"
              name="category"
              required
            >
              <USelect
                v-model="state.category"
                :items="[...categories]"
                class="w-full"
              />
            </UFormField>
          </div>

          <UFormField
            label="Nome"
            name="name"
            required
          >
            <UInput
              v-model="state.name"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Descrição"
            name="overview"
            required
          >
            <UTextarea
              v-model="state.overview"
              class="w-full"
              autoresize
            />
          </UFormField>

          <UFormField
            v-if="state.type !== 'Eletrônico'"
            label="Assinatura sonora"
            name="signature"
            required
          >
            <USelect
              v-model="(state.signature as SoundSignature)"
              :items="[...soundSignatures]"
              class="w-full"
            />
          </UFormField>

          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField
              label="Preço final"
              name="price"
              required
            >
              <UInput
                v-model="state.price"
                type="number"
                class="w-full"
              />
            </UFormField>

            <div class="flex items-end pb-2">
              <UCheckbox
                v-model="state.imported"
                label="Importado"
              />
            </div>
          </div>

          <UFormField
            label="Tags"
            name="tags"
            description="Separe as tags por vírgula."
          >
            <UInput
              v-model="state.tagsText"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Link para comprar"
            name="buy"
          >
            <UInput
              v-model="state.buy"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Link para a review"
            name="review"
          >
            <UInput
              v-model="state.review"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Imagem"
            name="image"
            description="A imagem será salva com um identificador único para permitir cache agressivo."
            required
          >
            <UFileUpload
              v-model="state.image"
              icon="i-lucide-image"
              label="Arraste a imagem aqui"
              :accept="DEVICE_IMAGE_MIME_TYPES.join(',')"
              description="PNG, JPEG e WebP · até 3 MiB"
              class="h-48"
            />
          </UFormField>

          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-default pt-4">
            <UButton
              to="/admin"
              color="neutral"
              variant="ghost"
            >
              Cancelar
            </UButton>

            <UButton
              type="submit"
              color="success"
              variant="soft"
              icon="i-lucide-circle-plus"
              :loading="saving"
            >
              Criar dispositivo
            </UButton>
          </div>
        </UForm>

        <aside class="space-y-4">
          <div class="rounded-lg border border-default p-4">
            <h2 class="mb-3 text-sm font-semibold text-highlighted">
              Prévia
            </h2>
            <DeviceCard
              :device="previewDevice"
              class="max-w-[450px]"
            />
          </div>

          <div class="rounded-lg border border-default p-4 text-sm">
            <dl class="grid gap-3">
              <div>
                <dt class="text-muted">
                  Status
                </dt>
                <dd class="font-medium text-highlighted">
                  Ainda não salvo
                </dd>
              </div>
              <div>
                <dt class="text-muted">
                  Slug previsto
                </dt>
                <dd class="break-all font-medium text-highlighted">
                  {{ previewDevice.slug }}
                </dd>
              </div>
              <div>
                <dt class="text-muted">
                  Imagem
                </dt>
                <dd class="break-all text-muted">
                  {{ state.image?.name || 'Nenhum arquivo selecionado' }}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </template>
  </UDashboardPanel>
</template>
