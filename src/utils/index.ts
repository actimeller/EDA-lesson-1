import { DELAY, RECONNECT_DELAY } from '../enviroment';

export const debounce = (func: Function, delay: number) => {
  let inDebounce: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func(...args), delay);
  };
};

export const createReduxAction = (type: string) => (payload: any) => ({
  type,
  payload,
});

export const connectionChecker = (
  func: Promise<any>, reconnect: any,
) => Promise.race([
  func,
  new Promise(
    (resolve, reject) => setTimeout(() => {
      reject(new Error('Connection error. Reconecting...'));
      setTimeout(reconnect, RECONNECT_DELAY);
    }, DELAY),
  ),
]);
