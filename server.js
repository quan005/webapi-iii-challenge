const express = require('express');
const helmet = require('helmet');
const bodyParser = express.json();

const server = express();
const userRouter = require('./users/userRouter.js');


// MiddleWare
server.use(bodyParser);
server.use(helmet());
server.use(logger);

server.use('/api/users', userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

// Custom MiddleWare Function

function logger(req, res, next) {
  const time = new Date().toLocaleTimeString();
  const date = new Date().toLocaleDateString();
  console.log(`${req.method} Request | from ${req.url} | at ${time}, ${date}`);
  next();
};

module.exports = server;
