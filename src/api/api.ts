import { DELAY } from '../enviroment';
import {
  Credentials, BaseResponse, User, TaskFilter, TaskListResponse,
  TaskResponse, Task,
} from './types';
import {
  fetchUser, setUser, getSessionUser, fetchTask,
  fetchTaskList, setTask, deleteTask,
} from './storage';
import { randomInt } from '../utils';
import { sharedWorker } from '../App';
import { SET_TASKS } from '../store/tasks/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const randomDelayResponse = async (func: Function) => {
  const delay = randomInt(0, DELAY * 1.5);
  setTimeout(func, delay);
};

const sharedWorkerSetTasks = (taskList: Task[]) => sharedWorker.port.postMessage({
  type: SET_TASKS,
  payload: Object.values(taskList),
});

const checkCredentials = async (
  { login, password }: Credentials,
): Promise<boolean> => {
  const user = await fetchUser(login);
  if (user && user.password === password) { return true; }
  return false;
};

const generateSessionId = (
  login: string,
): string => `${login}:${Math.random().toString(36).substr(2, 12)}`;

export const authorization = async (
  credentials: Credentials,
): Promise<BaseResponse> => {
  const { login } = credentials;
  if (await checkCredentials(credentials)) {
    const sessionId = generateSessionId(login);
    return {
      type: 'success',
      message: sessionId,
    };
  }
  throw new Error('Auth failed. Please provide correct credentials');
};

export const registration = async (
  { login, password }: Credentials,
): Promise<BaseResponse> => {
  const user = await fetchUser(login);
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
    return {
      type: 'success',
      message: sessionId,
    };
  }
  throw new Error('You cannot be registred with this username');
};

export const restore = async (
  { login, keyword }:
  { login: User['login'], keyword: User['keyword'] },
): Promise<BaseResponse> => {
  const user = await fetchUser(login);
  if (user?.keyword === keyword) {
    // todo: send restored password to email
    const sessionId = generateSessionId(login);
    return {
      type: 'success',
      message: sessionId,
    };
  }
  throw new Error('Key passoword is incorrect');
};

export const editUser = async (
  sessionId: string,
  newUserData: User,
):Promise<{ type: string; message: string}> => {
  const user = await getSessionUser(sessionId);
  if (user) {
    setUser(newUserData);
    return {
      type: 'success',
      message: 'Changes have been saved',
    };
  }
  throw new Error('Error while saving data. Try again later');
};

export const getFilteredTasks = async (
  sessionId: string,
  filter: TaskFilter,
): Promise<TaskListResponse> => {
  const user = await getSessionUser(sessionId);
  
  if (user) {
    const filteredTasks = (await fetchTaskList(user.tasks))
      .filter((task) => task.title.search(filter.title ? filter.title : '') > -1)
      .filter((task) => (filter.type ? task.type === filter.type : true))
      .filter((task) => (filter.status ? task.status === filter.status : true))
      .filter((task) => (
        filter.plannedStartDate ? task.plannedStartDate >= filter.plannedStartDate : true
      ));
    return {
      type: 'success',
      message: 'Tasks have been loaded',
      data: filteredTasks,
    };
  }
  throw new Error('Error while getting tasks. Try again later');
};

export const getTask = async (
  sessionId: string,
  id: Task['id'],
): Promise<TaskResponse> => {
  const user = await getSessionUser(sessionId);
  if (user) {
    const filteredTask = await fetchTask(id);
    return {
      type: 'success',
      message: 'Task has been loaded',
      data: filteredTask,
    };
  }
  throw new Error('Error while getting task. Try again later');
};

export const editTask = async (
  sessionId: string,
  data: Task,
): Promise<TaskListResponse> => {
  const user = await getSessionUser(sessionId);
  if (user && user.tasks.includes(data.id)) {
    await setTask(data);
    const taskList = await fetchTaskList(user.tasks);
    sharedWorkerSetTasks(taskList);
    return {
      type: 'success',
      message: 'Task has been updated',
      data: taskList,
    };
  }
  throw new Error('Error while saving task. Try again later');
};

export const createTask = async (
  sessionId: string,
  data: Task,
): Promise<TaskListResponse> => {
  const user = await getSessionUser(sessionId);
  if (user) {
    Promise.all([
      setUser({
        ...user,
        tasks: user.tasks.concat(data.id),
      }),
      setTask(data),
    ]);

    const taskList = await fetchTaskList(user.tasks);
    sharedWorkerSetTasks(taskList);
    return {
      type: 'success',
      message: 'Task has been created',
      data: taskList,
    };
  }
  throw new Error('Error while creating task. Try again later');
};

export const removeTask = async (
  sessionId: string,
  data: Task,
): Promise<TaskListResponse> => {
  const user = await getSessionUser(sessionId);
  if (user && user.tasks.includes(data.id)) {
    deleteTask(data.id);
    const taskList = await fetchTaskList(user.tasks);
    sharedWorkerSetTasks(taskList);
    return {
      type: 'success',
      message: 'Task has been updated',
      data: taskList,
    };
  }
  throw new Error('Error while saving task. Try again later');
};
