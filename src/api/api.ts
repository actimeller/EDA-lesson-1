import { DELAY } from '../enviroment';
import {
  Credentials, BaseResponse, User, TaskFilter, TaskListResponse,
  TaskResponse, Task,
} from './types';
import {
  getUser, setUser, getSessionUser, getAllUsersTasks, setTask,
} from './storage';

const checkCredentials = ({ login, password }: Credentials): boolean => {
  const user = getUser(login);
  if (user && user.password === password) { return true; }
  return false;
};

const generateSessionId = (
  login: string,
): string => `${login}:${Math.random().toString(36).substr(2, 12)}`;

export const authorization = (
  credentials: Credentials,
): Promise<BaseResponse> => new Promise((resolve, reject) => {
  const { login } = credentials;
  setTimeout(() => {
    if (checkCredentials(credentials)) {
      const sessionId = generateSessionId(login);
      resolve({
        type: 'success',
        message: sessionId,
      });
    } else {
      reject(new Error('Auth failed. Please provide correct credentials'));
    }
  }, DELAY);
});

export const registration = (
  { login, password }: Credentials,
): Promise<BaseResponse> => new Promise((resolve, reject) => {
  setTimeout(() => {
    const user = getUser(login);
    if (!user) {
      setUser({
        login,
        password,
        keyword: '',
        name: login,
        photo: '',
        tasks: [],
      });
      const sessionId = generateSessionId(login);
      resolve({
        type: 'success',
        message: sessionId,
      });
    } else {
      reject(new Error('You cannot be registred with this username'));
    }
  }, DELAY);
});

export const restore = (
  { login, keyword }:
  { login: User['login'], keyword: User['keyword'] },
): Promise<BaseResponse> => new Promise((resolve, reject) => {
  setTimeout(() => {
    const user = getUser(login);
    if (user?.keyword === keyword) {
      // todo: send restored password to email
      const sessionId = generateSessionId(login);
      resolve({
        type: 'success',
        message: sessionId,
      });
    } else {
      reject(new Error('Key passoword is incorrect'));
    }
  }, DELAY);
});

export const editUser = (
  sessionId: string,
  newUserData: User,
):Promise<{ type: string; message: string}> => new Promise((resolve, reject) => {
  const user = getSessionUser(sessionId);
  setTimeout(() => {
    if (user) {
      setUser(newUserData);
      resolve({
        type: 'success',
        message: 'Changes have been saved',
      });
    } else {
      reject(new Error('Error while saving data. Try again later'));
    }
  }, DELAY);
});

export const getFilteredTasks = (
  sessionId: string,
  filter: TaskFilter,
): Promise<TaskListResponse> => new Promise((resolve, reject) => {
  const user = getSessionUser(sessionId);
  setTimeout(() => {
    if (user) {
      const filteredTasks = getAllUsersTasks(user)
        .filter((task) => task.title.search(filter.title) > -1)
        .filter((task) => (filter.type ? task.type === filter.type : true))
        .filter((task) => (
          filter.plannedStartDate ? task.plannedStartDate >= filter.plannedStartDate : true
        ));
      // console.info(filteredTasks);
      resolve({
        type: 'success',
        message: filteredTasks,
      });
    } else {
      reject(new Error('Error while getting tasks. Try again later'));
    }
  }, DELAY);
});

export const getTask = (
  sessionId: string,
  id: Task['id'],
): Promise<TaskResponse> => new Promise((resolve, reject) => {
  const user = getSessionUser(sessionId);
  setTimeout(() => {
    if (user) {
      const filteredTask = getAllUsersTasks(user)
        .find((task) => task.id === id);
      resolve({
        type: 'success',
        message: filteredTask,
      });
    } else {
      reject(new Error('Error while getting task. Try again later'));
    }
  }, DELAY);
});

export const editTask = (
  sessionId: string,
  data: Task,
): Promise<BaseResponse> => new Promise((resolve, reject) => {
  const user = getSessionUser(sessionId);
  setTimeout(() => {
    if (user && getAllUsersTasks(user).find((task) => task.id === data.id)) {
      setTask(data);
      resolve({
        type: 'success',
        message: 'Task has been updated',
      });
    } else {
      reject(new Error('Error while saving task. Try again later'));
    }
  }, DELAY);
});

export const createTask = (
  sessionId: string,
  data: Task,
): Promise<BaseResponse> => new Promise((resolve, reject) => {
  const user = getSessionUser(sessionId);
  setTimeout(() => {
    if (user) {
      setUser({
        ...user,
        tasks: user.tasks.concat(data.id),
      });
      setTask(data);
      resolve({
        type: 'success',
        message: 'Task has been updated',
      });
    } else {
      reject(new Error('Error while creating task. Try again later'));
    }
  }, DELAY);
});
