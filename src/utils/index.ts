import { DELAY, RECONNECT_DELAY } from '../enviroment';

export const debounce = (func: Function, delay: number) => {
  let inDebounce: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func(...args), delay);
  };
};

export const connectionChecker = async (
  func: Promise<any>, reconnect: Function,
) => Promise.race([
  func,
  new Promise(
    (resolve, reject) => setTimeout(() => {
      reject(new Error('Connection error. Reconecting...'));
    }, DELAY),
  ),
]).catch((error) => {
  setTimeout(reconnect, RECONNECT_DELAY);
  throw (error);
});

export const randomInt = (
  min:number, max: number,
) => min + Math.floor((max - min) * Math.random());
