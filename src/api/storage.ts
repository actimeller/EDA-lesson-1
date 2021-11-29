import { LOCAL_STORAGE_TASKS, LOCAL_STORAGE_USERS } from '../enviroment';
import { User, Task } from './types';

let buffer: Record<string, any>[] = [];

export const fetchUser = async (login: User['login']): Promise<User | undefined> => {
  const response = await fetch(`/api/users/${login}`);
  if (!response.ok) {
    const localStorageUsers = localStorage.getItem(LOCAL_STORAGE_USERS);
    return localStorageUsers ? JSON.parse(localStorageUsers)[login] : undefined;
  }
  return response.json();
};

export const setUser = async (user: User) => {
  const response = await fetch(`/api/userUpdate/${user.login}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    buffer.push({ setUser: user });
    const localStorageUsers = localStorage.getItem(LOCAL_STORAGE_USERS);
    localStorage.setItem(LOCAL_STORAGE_USERS, JSON.stringify({
      ...JSON.parse(localStorageUsers || ''),
      [user.login]: { ...user },
    }));
  }
};

export const getSessionUser = (sessionId: string) => {
  const [login] = sessionId.split(':');
  return fetchUser(login);
};

export const fetchTask = async (id: Task['id']): Promise<Task | undefined> => {
  const response = await fetch(`/api/task/${id}`);
  if (!response.ok) {
    const localStorageTasks = localStorage.getItem(LOCAL_STORAGE_TASKS);
    return localStorageTasks ? JSON.parse(localStorageTasks)[id] : undefined;
  }
  return response.json();
};

export const fetchTaskList = async (ids: Task['id'][]): Promise<Task[]> => {
  const response = await fetch(`/api/tasks/${ids.join(',')}`);
  if (!response.ok) {
    const localStorageTasks = localStorage.getItem(LOCAL_STORAGE_TASKS);

    const tasksObj: Record <string, Task> = localStorageTasks
      ? JSON.parse(localStorageTasks) : undefined;

    return Object.values(tasksObj)
      .filter((item: Task) => ids.includes(item.id));
  }
  return response.json();
};

export const setTask = async (task: Task) => {
  const response = await fetch(`/api/taskUpdate/${task.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    buffer.push({ setTask: task });
    const localStorageTasks = localStorage.getItem(LOCAL_STORAGE_TASKS);
    localStorage.setItem(LOCAL_STORAGE_TASKS, JSON.stringify({
      ...JSON.parse(localStorageTasks || ''),
      [task.id]: { ...task },
    }));
  }
};

export const deleteTask = async (id: String) => {
  const response = await fetch(`/api/taskDelete/${id}`, {
    method: 'POST',
  });
  if (!response.ok) {
    buffer.push({ delete: id });
    const localStorageTasks = localStorage.getItem(LOCAL_STORAGE_TASKS);
    localStorage.setItem(LOCAL_STORAGE_TASKS, JSON.stringify({
      ...JSON.parse(localStorageTasks || ''),
    }));
  }
};

export const storageMethods: Record<string, any> = {
  setTask,
  deleteTask,
  setUser,
};

setInterval(async () => {
  Promise.all(
    buffer.map((bufferRequest) => {
      const [name, args] = Object.entries(bufferRequest).flat();
      return storageMethods[name](args);
    }),
  );
  buffer = [];
}, 3000);
