const express = require(`express`);

const helmet = require(`helmet`);
const cors = require(`cors`);


const config = require('./api/config.js');

const projectRouter = require('./projects/projectRouter.js');
const actionRouter = require('./actions/actionRouter.js');

const server = express();


function logger(req, res, next) {
  console.log('body: ', req.body);

  next();
};


server.use(helmet());
server.use(express.json());
server.use(logger);

server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);


server.get(`/`, (req, res) =>
  res.json({ api: `API up` })
);


const port = config.port || 5000;


server.listen(port, () =>
  console.log(`API up on port ${port}`));
