const express = require('express');
const fs = require('fs');

const app = express();
const port = 8080;

app.get('/api/tasks/:id', (req, res) => {
  console.info('request...', req.params.id);
  const rawdata = fs.readFileSync('users.json');

  res.send(rawdata);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
