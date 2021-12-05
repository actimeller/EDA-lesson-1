import { Task } from '../../api';
import * as types from './types';

export type AsyncSetTasks = {
  type: typeof types.ASYNC_SET_TASKS;
  payload: { snapshotTasks: Task[]; sessionId: string };
};

export const asyncSetTasks = (payload: AsyncSetTasks['payload']) => ({
  type: types.ASYNC_SET_TASKS,
  payload,
});

export type UpdateTasks = {
  type: typeof types.UPDATE_TASKS;
};

export const updateTasks = () => ({
  type: types.UPDATE_TASKS,
});

export type SetTasks = {
  type: typeof types.SET_TASKS;
  payload: Task[];
};

export const setTasks = (payload: SetTasks['payload']) => ({
  type: types.SET_TASKS,
  payload,
});

export type SetTodayTasks = {
  type: typeof types.SET_TODAY_TASKS;
  payload: Task[];
};

export const setTodayTasks = (payload: SetTodayTasks['payload']) => ({
  type: types.SET_TODAY_TASKS,
  payload,
});

export type ActionTypes = SetTodayTasks | SetTasks | UpdateTasks;
