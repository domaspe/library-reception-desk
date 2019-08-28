const express = require('express');
const os = require('os');
const path = require('path');
const bodyParser = require('body-parser');
const nocache = require('nocache');
const fs = require('fs');
const https = require('https');
const handlers = require('./handlers');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(nocache());

const rootDir = path.join(__dirname, '../..');

app.use(express.static('dist'));
app.use('/weights', express.static(path.join(rootDir, 'weights')));
app.use('/assets', express.static(path.join(rootDir, 'assets')));

app.get('/api/getUsername', (req, res) =>
  res.send({ username: os.userInfo().username })
);

app.get('/api/reload', (req, res) => {
  handlers.reloadDatabase();
  return res.sendStatus(200);
});

app.get('/api/users', (req, res) => {
  const users = handlers.getUsers();
  console.log('Users: ', users);
  return res.json(users);
});

app.get('/api/classes', (req, res) => {
  const descriptors = handlers.getDescriptors();
  return res.json(descriptors);
});

app.get('/api/items', (req, res) => {
  const items = handlers.getItems();
  return res.json(items);
});

app.post('/api/classes', (req, res) => {
  const { descriptors, label } = req.body;
  handlers.updateOrAddDescriptors(label, descriptors);
  res.sendStatus(200);
});

app.post('/api/users', (req, res) => {
  const { id } = req.body;
  handlers.updateOrAddUser(id);
  res.sendStatus(200);
});

app.post('/api/items/:id', (req, res) => {
  const { user } = req.body;
  const status = handlers.toggleUser(Number(req.params.id), user);
  res.status(200).json({
    status
  });
});

// / error handlers
// eslint-disable-next-line no-unused-vars
app.use(function errorHandler(err, req, res, next) {
  console.log(err.stack);

  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: err
    }
  });
});

let server = app;
if (process.env.NODE_ENV === 'production') {
  const httpsOptions = {
    cert: fs.readFileSync(path.join(rootDir, 'ssl', 'root.cert')),
    key: fs.readFileSync(path.join(rootDir, 'ssl', 'root.key'))
  };

  server = https.createServer(httpsOptions, app);
}

server.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
