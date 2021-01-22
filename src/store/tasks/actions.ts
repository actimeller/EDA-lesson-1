import { Task } from '../../api';
import * as types from './types';

export type SetTodayTasks = {
    type: typeof types.SET_TODAY_TASKS,
    payload: Task[]
};

export const setTodayTasks = (payload: Task[]) => ({
  type: types.SET_TODAY_TASKS,
  payload,
});

export type ActionTypes = SetTodayTasks
