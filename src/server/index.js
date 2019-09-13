const express = require('express');
const os = require('os');
const path = require('path');
const bodyParser = require('body-parser');
const nocache = require('nocache');
const fs = require('fs');
const https = require('https');
const handlers = require('./handlers');
const db = require('./database.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(nocache());

const rootDir = path.join(__dirname, '../..');

app.use(express.static('dist'));
app.use('/weights', express.static(path.join(rootDir, 'weights')));
app.use('/assets', express.static(path.join(rootDir, 'assets')));

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.get('/api/test', (req, res) => {
  db.getItems().then(users => console.log('>>> users', users));
  return res.sendStatus(200);
});

app.get('/api/statistics', (req, res, next) => {
  return handlers
    .getStatistics()
    .then(items => res.json(items))
    .catch(next);
});

app.get('/api/users', (req, res, next) => {
  return handlers
    .getUsers()
    .then(users => res.json(users))
    .catch(next);
});

app.get('/api/items', (req, res, next) => {
  return handlers
    .getItems()
    .then(items => res.json(items))
    .catch(next);
});

app.post('/api/users', (req, res, next) => {
  const { id, name, descriptors } = req.body;
  console.log('>>> ', { id, name });
  return handlers
    .addOrUpdateUser(Number(id), name, descriptors)
    .then(() => res.sendStatus(200))
    .catch(next);
});

app.post('/api/items', (req, res, next) => {
  const { id, userId } = req.body;
  return handlers
    .toggleUser(Number(id), Number(userId))
    .then(status =>
      res.status(200).json({
        status
      })
    )
    .catch(next);
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

let httpsServer = null;
if (process.env.NODE_ENV === 'production') {
  const httpsOptions = {
    cert: fs.readFileSync(path.join(rootDir, 'ssl', 'root.cert')),
    key: fs.readFileSync(path.join(rootDir, 'ssl', 'root.key'))
  };

  httpsServer = https.createServer(httpsOptions, app);
}

(httpsServer || app).listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${process.env.PORT || 8080}!`);
});
