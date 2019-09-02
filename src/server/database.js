const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dataPath = path.join(__dirname, '../../database');
const pathToDatabase = path.join(dataPath, 'local.sqlite3');

const db = new sqlite3.Database(pathToDatabase, err => {
  if (err) {
    console.log('Failed to start database', pathToDatabase, err);
  }
});

function closeDb() {
  db.close(() => {
    console.log('Database closed');
  });
}

['exit', 'SIGINT', `SIGHUP`].forEach(eventType => {
  process.on(eventType, () => {
    console.log('Received event:', eventType);
    closeDb();
  });
});

function run(query, args) {
  return new Promise((resolve, reject) => {
    db.run(query, args || [], err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}

function all(query, args) {
  return new Promise((resolve, reject) => {
    db.all(query, args || [], (err, rows) => {
      if (err) {
        return reject(err);
      }

      return resolve(rows);
    });
  });
}

function get(query, args) {
  return new Promise((resolve, reject) => {
    db.get(query, args || [], (err, row) => {
      if (err) {
        return reject(err);
      }

      return resolve(row);
    });
  });
}

function getUsers() {
  return all('SELECT * FROM users');
}

function getUser(id) {
  return get('SELECT * FROM users WHERE id = ?', [id]);
}

function getUserByName(name) {
  return get('SELECT * FROM users WHERE name = ? LIMIT 1', [name]);
}

async function updateUser(id, data) {
  const user = await getUser(id);
  const updated = { ...user, ...data };
  return run('UPDATE users SET name = ?, descriptors = ? WHERE id = ?', [
    updated.name,
    updated.descriptors,
    id
  ]);
}

function addUser(name, descriptors) {
  return run('INSERT INTO users (name, descriptors) VALUES(?, ?)', [
    name,
    descriptors
  ]);
}

function getItems() {
  return all('SELECT * FROM items');
}

function getItem(id) {
  return get('SELECT * FROM items WHERE id = ?', [id]);
}

function updateItem(id, data) {
  return getItem(id).then(item => {
    const updated = { ...item, ...data };
    return run(
      'UPDATE items SET primaryTitle = ?, secondaryTitle = ?, thumbnailUrl = ?, takenByUserId = ?, accessoryTaken = ?, timeTaken = ? WHERE id = ?',
      [
        updated.primaryTitle,
        updated.secondaryTitle,
        updated.thumbnailUrl,
        updated.takenByUserId,
        updated.accessoryTaken,
        updated.timeTaken,
        id
      ]
    );
  });
}

function log(itemId, userId, action, info) {
  return run(
    'INSERT INTO log (userId, itemId, action, info, timestamp) VALUES(?, ?, ?, ?, ?)',
    [userId, itemId, action, info, Date.now()]
  );
}

module.exports = {
  getUsers,
  getUser,
  getUserByName,
  updateUser,
  addUser,
  getItems,
  getItem,
  updateItem,
  log
};
