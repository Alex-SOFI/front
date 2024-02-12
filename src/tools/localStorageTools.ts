export const setLocalStorageItem = (item: string, value: string) =>
  window.localStorage.setItem(item, value);

export const getLocalStorageItem = (item: string) =>
  window.localStorage.getItem(item);

export const removeLocalStorageItem = (item: string) =>
  window.localStorage.removeItem(item);
