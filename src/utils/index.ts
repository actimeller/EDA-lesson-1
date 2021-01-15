// eslint-disable-next-line import/prefer-default-export
export const debounce = (func: Function, delay: number) => {
  let inDebounce: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func(...args), delay);
  };
};
