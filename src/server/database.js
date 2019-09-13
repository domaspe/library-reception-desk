const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dataPath = path.join(__dirname, '../../database');
const pathToDatabase = path.join(dataPath, 'local.sqlite3');

const LOG_TAKE_ITEM = 10;
const LOG_RETURN_ITEM = 11;

const LOG_CREATE_USER = 20;
const LOG_CREATE_USER_WITH_FACE = 21;
const LOG_UPDATE_USER = 22;
const LOG_UPDATE_USER_WITH_FACE = 23;

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
  return run('INSERT INTO users (name, descriptors) VALUES(?, ?)', [name, descriptors]);
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
      'UPDATE items SET primaryTitle = ?, secondaryTitle = ?, description = ?, thumbnailUrl = ?, takenByUserId = ?, accessoryTaken = ?, timeTaken = ? WHERE id = ?',
      [
        updated.primaryTitle,
        updated.secondaryTitle,
        updated.description,
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
  return run('INSERT INTO log (userId, itemId, action, info, timestamp) VALUES(?, ?, ?, ?, ?)', [
    userId,
    itemId,
    action,
    info,
    Date.now()
  ]);
}

function getmostPopularItems() {
  return all(
    `
    SELECT i.id, i.primaryTitle, i.secondaryTitle, i.description, ifnull(c.timesTaken, 0) as timesTaken
    FROM items AS i
    LEFT OUTER JOIN (
      SELECT itemId, count(*) as timesTaken
      FROM log WHERE action = ?
      GROUP BY itemId)  AS c ON i.id = c.itemId
    ORDER BY c.timesTaken DESC
    `,
    [LOG_TAKE_ITEM]
  ).then(rows => {
    const top = rows.slice(0, 3);

    let bot = rows.slice(-3);
    if (bot.every((val, i, arr) => val.timesTaken === arr[0].timesTaken)) {
      bot = rows.filter(row => row.timesTaken === bot[0].timesTaken);
    }

    return {
      top,
      bot: bot.reverse()
    };
  });
}

function getMostActiveUsers() {
  return all(
    `
    SELECT u.id, u.name, ifnull(c.timesTaken, 0) as timesTaken
    FROM users AS u
      LEFT OUTER JOIN (
        SELECT userId, count(*) as timesTaken
        FROM log WHERE action = ?
        GROUP BY userId)  AS c ON u.id = c.userId
    ORDER BY c.timesTaken DESC
    `,
    [LOG_TAKE_ITEM]
  ).then(rows => {
    const top = rows.filter(row => row.timesTaken > 0).slice(0, 3);

    return {
      top
    };
  });
}

module.exports = {
  getmostPopularItems,
  getMostActiveUsers,
  getUsers,
  getUser,
  getUserByName,
  updateUser,
  addUser,
  getItems,
  getItem,
  updateItem,
  log,
  LOG_TAKE_ITEM,
  LOG_RETURN_ITEM,
  LOG_CREATE_USER,
  LOG_CREATE_USER_WITH_FACE,
  LOG_UPDATE_USER,
  LOG_UPDATE_USER_WITH_FACE
};
