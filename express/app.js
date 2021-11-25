const express = require('express');

const app = express();
const port = 8080;

app.get('/api/tasks/:id', (req, res) => {
  console.info('request...', req.params.id);
  res.send(`Hello World! ${req.params.id}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
