/* eslint-disable no-console */

const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 8080;

const USERS_STORAGE = 'users.json';
const TASKS_STORAGE = 'tasks.json';

const getUsersJSON = () => fs.readFileSync(USERS_STORAGE);
const getTasksJSON = () => fs.readFileSync(TASKS_STORAGE);

app.get('/api/users', (req, res) => {
  const users = getUsersJSON();
  res.send(users);
});

app.get('/api/users/:id', (req, res) => {
  const user = JSON.parse(getUsersJSON())[req.params.id];
  return user ? res.send(user) : res.status(404).send(`user ${req.params.id} not found`);
});

app.post('/api/usersUpdate', (req, res) => {
  const users = JSON.parse(getUsersJSON());
  fs.writeFileSync(USERS_STORAGE, JSON.stringify({
    ...users,
    ...req.body,
  }));
  res.status(200).send('users updated');
});

app.post('/api/userUpdate/:id', (req, res) => {
  const users = JSON.parse(getUsersJSON());
  const user = users[req.params.id];
  if (user) {
    fs.writeFileSync(USERS_STORAGE, JSON.stringify({
      ...users,
      [req.params.id]: {
        ...user,
        ...req.body,
      },
    }));
    return res.status(200).send(`user ${req.params.id} updated`);
  }
  return res.status(404).send(`user ${req.params.id} not found`);
});

app.get('/api/task/:id', (req, res) => {
  const task = JSON.parse(getTasksJSON())[req.params.id];
  return task ? res.send(task) : res.status(404).send(`task ${req.params.id} not found`);
});

app.get('/api/tasks/:ids', (req, res) => {
  const tasksIds = req.params.ids.split(',');
  const tasks = JSON.parse(getTasksJSON());

  const filteredTasks = tasksIds.map((id) => tasks[id])
    .filter(Boolean);
  return res.send(filteredTasks);
});

app.post('/api/taskUpdate/:id', (req, res) => {
  const tasks = JSON.parse(getTasksJSON());
  const task = tasks[req.params.id];
  if (task) {
    fs.writeFileSync(TASKS_STORAGE, JSON.stringify({
      ...tasks,
      [req.params.id]: {
        ...task,
        ...req.body,
      },
    }));
    return res.status(200).send(`task ${req.params.id} updated`);
  }
  return res.status(404).send(`task ${req.params.id} not found`);
});

app.post('/api/taskDelete/:id', (req, res) => {
  const tasks = JSON.parse(getTasksJSON());
  const task = tasks[req.params.id];
  if (task) {
    delete tasks[req.params.id];

    fs.writeFileSync(TASKS_STORAGE, JSON.stringify({
      ...tasks,
    }));

    const users = JSON.parse(getUsersJSON());
    const usersWithTask = Object.keys(users)
      .map((key) => (users[key].tasks.includes(req.params.id) ? key : null))
      .filter(Boolean);

    if (usersWithTask.length > 0) {
      usersWithTask.forEach((id) => {
        users[id] = {
          ...users[id],
          tasks: users[id].tasks.filter((taskId) => taskId !== req.params.id),
        };
      });
      fs.writeFileSync(USERS_STORAGE, JSON.stringify(users));
    }

    return res.status(200).send(`task ${req.params.id} deleted`);
  }

  return res.status(404).send(`task ${req.params.id} not found`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
