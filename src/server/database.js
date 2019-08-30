const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dataPath = path.join(__dirname, '../../data');

let db;

function createTables() {
  db.serialize(() => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,  
        name TEXT NOT NULL,
        descriptors TEXT
      );
  `,
      (res, err) => {
        console.error('Create table "users" result', res, err);
      }
    );

    db.run(
      `
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        primaryTitle TEXT NOT NULL,
        secondaryTitle TEXT,
        description TEXT,
        thumbnailUrl TEXT  NOT NULL,
        takenByUserId INTEGER,
        accessoryTaken INTEGER,
        timeTaken INTEGER
      );
  `,
      (res, err) => {
        console.error('Create table "items" result', res, err);
      }
    );
  });
}

db = new sqlite3.Database(path.join(dataPath, 'database.sqlite3'), err => {
  if (err) {
    console.log('Failed to start database', err);
    return;
  }

  console.log('Init database');

  createTables();
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
  console.log('>>> id', id);
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
  return all('SELECT * FROM items').then(items => items.slice(0, 10));
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

module.exports = {
  getUsers,
  getUser,
  getUserByName,
  updateUser,
  addUser,
  getItems,
  getItem,
  updateItem
};
