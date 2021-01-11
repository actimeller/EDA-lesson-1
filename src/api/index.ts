import usersResponse from './users.json';
import tasksResponse from './tasks.json';

export interface ITask {
  id: string,
  title: string,
  description: string,
  date: string,
  priority: 'low' | 'high',
}

export interface ITaskFilter {
  title: ITask['title'],
  date: ITask['date']
  priority: ITask['priority'] | undefined,
}

export interface IAuthorizationResponse {
  type: string;
  message: string
}

interface Credentials {
  login: string,
  password: string,
}

interface User extends Credentials {
  keyword: string;
  name: string;
  photo: string;
  tasks: string[];
}

const DELAY = 500;

let users = usersResponse as { [key: string]: User };
let tasks = tasksResponse as { [key: string]: ITask };

const checkCredentials = ({ login, password }: Credentials): boolean => {
  const user = users[login];
  if (user && user.password === password) { return true; }
  return false;
};

const generateSessionId = (
  login: string,
): string => `${login}:${Math.random().toString(36).substr(2, 12)}`;

export const authorization = (credentials: Credentials) => new Promise((resolve, reject) => {
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
  { login }: Credentials,
) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (!users[login]) {
      // todo: save this user in db
      const sessionId = generateSessionId(users.max.login);
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
) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (users[login].keyword === keyword) {
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

export const getUser = (sessionId: string): User | undefined => {
  const [login] = sessionId.split(':');
  return users[login];
};

export const editUser = (
  sessionId: string,
  newUserData: User,
) => new Promise((resolve, reject) => {
  const user = getUser(sessionId);
  setTimeout(() => {
    // todo: save newData to db
    if (user) {
      users = {
        ...users,
        [user.login]: { ...newUserData },
      };
      resolve({
        type: 'success',
        message: 'Changes have been saved',
      });
    } else {
      reject(new Error('Error while saving data. Try again later'));
    }
  }, DELAY);
});

const getUsersTasks = (sessionId: string): ITask[] | false => {
  const user = getUser(sessionId);
  if (user) {
    const usersTasks = (user as User).tasks
      .map((taskId:string) => tasks[taskId])
      .filter(Boolean);
    return usersTasks;
  }
  return false;
};

export const getFilteredTasks = (
  sessionId: string,
  filter: ITaskFilter,
) => new Promise((resolve, reject) => {
  const usersTasks = getUsersTasks(sessionId);
  setTimeout(() => {
    if (usersTasks) {
      const filteredTasks = usersTasks
        .filter((task) => task.title.search(filter.title) > -1)
        .filter((task) => (filter.priority ? task.priority === filter.priority : true))
        .filter((task) => (filter.date !== '' ? task.date === filter.date : true));
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
  id: ITask['id'],
) => new Promise((resolve, reject) => {
  const usersTasks = getUsersTasks(sessionId);
  setTimeout(() => {
    if (usersTasks) {
      const filteredTask = usersTasks
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
  data: ITask,
) => new Promise((resolve, reject) => {
  const usersTasks = getUsersTasks(sessionId);
  setTimeout(() => {
    if (usersTasks && usersTasks.find((task) => task.id === data.id)) {
      // todo: save newData to db
      tasks = {
        ...tasks,
        [data.id]: { ...data },
      };
      resolve({
        type: 'success',
        message: 'Task has been updated',
      });
    } else {
      reject(new Error('Error while saving task. Try again later'));
    }
  }, DELAY);
});
