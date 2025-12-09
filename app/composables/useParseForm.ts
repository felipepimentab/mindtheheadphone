import type { MultiPartData } from 'h3';

export function useParseForm(form: MultiPartData[]) {
  function getString(n: string) {
    return form.find(field => field.name === n)?.data.toString();
  }

  function getNumber(n: string) {
    const s = form.find(field => field.name === n)?.data.toString();
    if (s) {
      return parseInt(s);
    }
    return undefined;
  }

  function getFile(n: string) {
    return form.find(field => field.name === n);
  }

  return {
    getString,
    getNumber,
    getFile
  };
};
