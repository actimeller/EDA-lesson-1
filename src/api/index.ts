import usersResponse from './users.json';

const DELAY = 1000;

interface Credentials {
    login: string,
    password: string,
}

interface User extends Credentials {
    keyword: string;
    name: string;
    photo: string;
}

let users: { [key: string]: User } = usersResponse;

const checkCredentials = ({ login, password }: Credentials): boolean => {
  const user = users[login];
  if (user && user.password === password) { return true; }
  return false;
};

const generateSessionId = (login: string): string => `${login}:${Math.random().toString(36).substr(2, 12)}`;

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

export const registration = ({ login }: Credentials) => new Promise((resolve, reject) => {
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

export const restore = ({ login, keyword }: {login: User['login'], keyword: User['keyword']}) => new Promise((resolve, reject) => {
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

export const editUser = (sessionId: string, newUserData: User) => new Promise((resolve, reject) => {
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
        message: 'ура',
      });
    } else {
      reject(new Error('Can'));
    }
  }, DELAY);
});
