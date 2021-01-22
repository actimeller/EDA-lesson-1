import moment from 'moment';
import { DELAY, RECONNECT_DELAY } from '../enviroment';
import { Task } from '../api';

export const debounce = (func: Function, delay: number) => {
  // eslint-disable-next-line no-undef
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

export const createReduxAction = (type: string) => (payload: any) => ({
  type,
  payload,
});

export const isTodayTask = (task: Task) => task.plannedStartDate >= +moment().startOf('day');
