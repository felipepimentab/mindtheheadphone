<script lang="ts" setup>
import type { Device, DeviceType } from '~~/shared/types/device';
import type { SoundSignature } from '~~/shared/types/soundSignatures';

definePageMeta({
  layout: 'dashboard'
});

type AdminDevice = Device & {
  _id?: string
  createdAt?: string
  updatedAt?: string
};

type DeviceEditState = {
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

const route = useRoute();
const router = useRouter();
const toast = useToast();
const deviceId = computed(() => String(route.params.id));

const { data: device, error, pending } = await useFetch<AdminDevice>(() => `/api/devices/${encodeURIComponent(deviceId.value)}`);

const state = reactive<DeviceEditState>({
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
const deleting = ref(false);
const imagePreview = computed(() => {
  if (state.image) return URL.createObjectURL(state.image);
  return device.value?.img || '/image/headphones.png';
});
const categories = computed<string[]>(() => {
  return availableCategories[state.type] || [];
});

watch(device, (value) => {
  if (!value) return;

  state.type = value.type;
  state.name = value.name || '';
  state.price = value.price || 0;
  state.imported = value.imported || false;
  state.overview = value.overview || '';
  state.review = value.review || '';
  state.buy = value.buy || '';
  state.tagsText = value.tags?.join(', ') || '';
  state.image = undefined;
  state.category = value.category || '';
  state.signature = value.signature || '';
}, { immediate: true });

const previewDevice = computed<Partial<Device>>(() => {
  return {
    ...device.value,
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

async function saveDevice() {
  saving.value = true;

  try {
    await $fetch(`/api/devices/${encodeURIComponent(deviceId.value)}`, {
      method: 'PUT',
      body: buildFormData()
    });
    toast.add({
      title: 'Dispositivo atualizado',
      color: 'success'
    });
    await router.push('/admin');
  } catch (saveError) {
    toast.add({
      title: 'Erro ao atualizar',
      description: saveError instanceof Error ? saveError.message : 'Não foi possível salvar o dispositivo.',
      color: 'error'
    });
  } finally {
    saving.value = false;
  }
}

async function deleteDevice() {
  if (!confirm(`Excluir "${state.name}"? Esta ação não pode ser desfeita.`)) return;

  deleting.value = true;

  try {
    await $fetch(`/api/devices/${encodeURIComponent(deviceId.value)}`, {
      method: 'DELETE'
    });
    toast.add({
      title: 'Dispositivo excluído',
      color: 'success'
    });
    await router.push('/admin');
  } catch (deleteError) {
    toast.add({
      title: 'Erro ao excluir',
      description: deleteError instanceof Error ? deleteError.message : 'Não foi possível excluir o dispositivo.',
      color: 'error'
    });
  } finally {
    deleting.value = false;
  }
}
</script>

<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar
        :title="device?.name || 'Editar dispositivo'"
        icon="i-lucide-pencil"
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
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        icon="i-lucide-circle-alert"
        title="Não foi possível carregar o dispositivo"
        :description="error.message"
      />

      <div
        v-else-if="pending"
        class="grid gap-6 lg:grid-cols-[minmax(0,560px)_minmax(320px,1fr)]"
      >
        <USkeleton class="h-[720px] rounded-lg" />
        <USkeleton class="h-[520px] rounded-lg" />
      </div>

      <div
        v-else
        class="grid gap-6 lg:grid-cols-[minmax(0,560px)_minmax(320px,1fr)]"
      >
        <UForm
          :state="state"
          class="space-y-4"
          @submit.prevent="saveDevice"
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
            description="Envie uma nova imagem apenas se quiser substituir a atual."
          >
            <UFileUpload
              v-model="state.image"
              icon="i-lucide-image"
              label="Arraste a nova imagem aqui"
              description="PNG e JPG"
              class="h-48"
            />
          </UFormField>

          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-default pt-4">
            <UButton
              color="error"
              variant="soft"
              icon="i-lucide-trash-2"
              :loading="deleting"
              @click="deleteDevice"
            >
              Excluir
            </UButton>

            <div class="flex gap-2">
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
                icon="i-lucide-save"
                :loading="saving"
              >
                Salvar alterações
              </UButton>
            </div>
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
                  Criado em
                </dt>
                <dd class="font-medium text-highlighted">
                  {{ device?.createdAt ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(device.createdAt)) : '-' }}
                </dd>
              </div>
              <div>
                <dt class="text-muted">
                  Atualizado em
                </dt>
                <dd class="font-medium text-highlighted">
                  {{ device?.updatedAt ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(device.updatedAt)) : '-' }}
                </dd>
              </div>
              <div>
                <dt class="text-muted">
                  URL da imagem
                </dt>
                <dd class="break-all text-muted">
                  {{ device?.img }}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </template>
  </UDashboardPanel>
</template>
