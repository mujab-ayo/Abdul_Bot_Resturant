const express = require('express');
const cookieParser = require('cookie-parser');

const attachSession = require('./middleware/session');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(attachSession);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

module.exports = app;