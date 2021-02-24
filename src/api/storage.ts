import usersResponse from './users.json';
import tasksResponse from './tasks.json';
import { LOCAL_STORAGE_TASKS, LOCAL_STORAGE_USERS } from '../enviroment';
import { User, Task } from './types';
import { sharedWorker } from '../App';
import { SET_TASKS } from '../store/tasks/types';

const initialUsers: Record<string, User> = usersResponse;
const initialTasks: Record<string, Task> = tasksResponse as any;

export const getAllUsers = (): Record<string, User> => {
  const localStorageUsers = localStorage.getItem(LOCAL_STORAGE_USERS);
  return localStorageUsers == null ? usersResponse : JSON.parse(localStorageUsers);
};

export const getUser = (login: User['login']): User | undefined => {
  const localStorageUsers = localStorage.getItem(LOCAL_STORAGE_USERS);
  return localStorageUsers == null ? initialUsers[login]
    : JSON.parse(localStorageUsers)[login];
};

const setUsers = (users: Record<string, User>) => {
  localStorage.setItem(LOCAL_STORAGE_USERS, JSON.stringify(users));
};

export const setUser = (user: User) => {
  const users = getAllUsers();
  setUsers({
    ...users,
    [user.login]: { ...user },
  });
};

export const getSessionUser = (sessionId: string) => {
  const [login] = sessionId.split(':');
  return getUser(login);
};

const getAllTasks = (): Record<string, Task> => {
  const localStorageTasks = localStorage.getItem(LOCAL_STORAGE_TASKS);
  return localStorageTasks == null ? tasksResponse : JSON.parse(localStorageTasks);
};

const getTask = (id: Task['id']): Task | undefined => {
  const localStorageTasks = localStorage.getItem(LOCAL_STORAGE_TASKS);
  return localStorageTasks == null ? initialTasks[id]
    : JSON.parse(localStorageTasks)[id];
};

const setTasks = (tasks: Record<string, Task>) => {
  localStorage.setItem(LOCAL_STORAGE_TASKS, JSON.stringify(tasks));
  sharedWorker.port.postMessage({
    type: SET_TASKS,
    payload: Object.values(tasks),
  });
};

export const setTask = (task: Task) => {
  const tasks = getAllTasks();
  setTasks({
    ...tasks,
    [task.id]: { ...task },
  });
};

export const deleteTask = (task: Task) => {
  const tasks = getAllTasks();
  delete tasks[task.id];
  setTasks({
    ...tasks,
  });
};

export const getAllUsersTasks = (user: User): Task[] => user.tasks
  .map((taskId:string) => getTask(taskId)!)
  .filter(Boolean);
