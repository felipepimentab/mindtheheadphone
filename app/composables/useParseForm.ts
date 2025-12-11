import type { MultiPartData } from 'h3';

export function useParseForm(form: MultiPartData[]) {
  function getString(n: string) {
    return form.find(field => field.name === n)?.data.toString();
  }

  function getNumber(n: string) {
    const s = form.find(field => field.name === n)?.data.toString();
    if (s) {
      return parseFloat(s);
    }
    return undefined;
  }

  function getFile(n: string) {
    return form.find(field => field.name === n);
  }

  function getArray(n: string) {
    let hasField = true;
    let i = 0;
    const arr = [];

    while (hasField) {
      const fieldData = form.find(field => field.name === `${n}[${i}]`)?.data.toString();
      if (!fieldData) {
        hasField = false;
      } else {
        arr.push(fieldData);
      }
      i++;
    }

    return arr;
  }

  function getBoolean(n: string) {
    const b = form.find(field => field.name === n)?.data.toString();
    return b === '1';
  }

  return {
    getString,
    getNumber,
    getFile,
    getArray,
    getBoolean
  };
};
