import type { FormSubmitEvent } from '@nuxt/ui';

export function useDeviceForm(event: FormSubmitEvent<DeviceFormSchema>) {
  const name = event.data.name;
  const price = event.data.price;
  const image = event.data.image;
  const imported = event.data.imported;
  const category = event.data.category;
  const overview = event.data.overview;
  const review = event.data.review;
  const buy = event.data.buy;
  const signature = event.data.signature;
  const type = event.data.type;
  const tags = event.data.tags;

  const errors: string[] = [];

  function formIsValid(): boolean {
    let valid = true;

    if (type === 'Earphone' || type === 'Headphone') {
      if (!signature) {
        valid = false;
        errors.push('Headphones e Earphones precisam ter uma assinatura sonora');
      }
    }

    return valid;
  }

  function buildFormData(): FormData {
    const formData = new FormData();

    formData.append(DeviceFormKeys.NAME, name);
    formData.append(DeviceFormKeys.PRICE, price.toString());
    formData.append(DeviceFormKeys.IMAGE, image);
    formData.append(DeviceFormKeys.CATEGORY, category);
    formData.append(DeviceFormKeys.OVERVIEW, overview);
    formData.append(DeviceFormKeys.TYPE, type);
    formData.append(DeviceFormKeys.IMPORTED, imported ? '1' : '0');
    if (review)
      formData.append(DeviceFormKeys.REVIEW, review);
    if (buy)
      formData.append(DeviceFormKeys.BUY, buy);
    if (signature)
      formData.append(DeviceFormKeys.SIGNATURE, signature);
    tags.forEach((tag, i) => {
      formData.append(`${DeviceFormKeys.TAGS}[${i}]`, tag);
    });

    return formData;
  }

  async function handleSubmit() {
    if (!formIsValid()) {
      throw new Error('Form is not valid');
    }
    const formData = buildFormData();
    console.log('🔵 ~ formData:', formData);
    try {
      await $fetch('/api/devices/create', {
        method: 'POST',
        body: formData
      });
    } catch (error) {
      console.error(error);
    }
  }

  return {
    handleSubmit,
    formIsValid,
    errors
  };
};

//     await $fetch('/api/headphone/create', {
//       method: 'POST',
//       body: formData
//     })

//     toast.add({
//       title: 'Erro',
//       description: err as string,
//       color: 'error'
//     });

//     toast.add({
//       title: 'Sucesso',
//       description: 'Fone cadastrado com sucesso!',
//       color: 'success'
//     });
