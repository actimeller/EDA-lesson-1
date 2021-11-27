/* eslint-disable no-console */

const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 8080;

const USERS_STORAGE = 'users.json';
const TASKS_STORAGE = 'tasks.json';

app.get('/api/users', (req, res) => {
  const rawdata = fs.readFileSync(USERS_STORAGE);
  res.send(rawdata);
});

app.get('/api/users/:id', (req, res) => {
  console.info('request...', req.params.id);
  const user = JSON.parse(fs.readFileSync(USERS_STORAGE))[req.params.id];
  return user ? res.send(user) : res.status(404).send(`user ${req.params.id} not found`);
});

app.post('/api/usersUpdate', (req, res) => {
  const rawdata = JSON.parse(fs.readFileSync(USERS_STORAGE));
  fs.writeFileSync(USERS_STORAGE, JSON.stringify({
    ...rawdata,
    ...req.body,
  }));
  res.status(200).send('users updated');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
