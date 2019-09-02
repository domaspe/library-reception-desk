const db = require('./database.js');

const STATUS_ASSIGN_SUCCESS = 'STATUS_ASSIGN_SUCCESS';
const STATUS_UNASSIGN_SUCCESS = 'STATUS_UNASSIGN_SUCCESS';
const STATUS_FAIL = 'STATUS_FAIL';

const LOG_TAKE_ITEM = 10;
const LOG_RETURN_ITEM = 11;

const LOG_CREATE_USER = 20;
const LOG_CREATE_USER_WITH_FACE = 21;
const LOG_UPDATE_USER = 22;
const LOG_UPDATE_USER_WITH_FACE = 23;

async function addOrUpdateUser(id, name, descriptors) {
  if (!name) {
    return new Error('Name is not provided');
  }

  const sameUser = await db.getUserByName(name);
  if (sameUser) {
    return db
      .updateUser(sameUser.id, {
        name,
        descriptors: descriptors ? JSON.stringify(descriptors) : null
      })
      .then(() =>
        db.log(
          null,
          sameUser.id,
          descriptors ? LOG_UPDATE_USER_WITH_FACE : LOG_UPDATE_USER,
          null
        )
      );
  }
  return db
    .addUser(name, descriptors ? JSON.stringify(descriptors) : null)
    .then(() =>
      db.log(
        null,
        null,
        descriptors ? LOG_CREATE_USER_WITH_FACE : LOG_CREATE_USER,
        name
      )
    );
}

function toggleUser(itemId, userId) {
  return db.getItem(itemId).then(item => {
    if (!item) return STATUS_FAIL;

    if (item.takenByUserId && (item.takenByUserId === userId || !userId)) {
      return db
        .updateItem(itemId, {
          takenByUserId: null,
          timeTaken: null
        })
        .then(() =>
          db.log(itemId, userId || item.takenByUserId, LOG_RETURN_ITEM, null)
        )
        .then(() => STATUS_UNASSIGN_SUCCESS);
    }

    if (!item.takenByUserId) {
      return db.getUser(userId).then(user => {
        if (!user) return STATUS_FAIL;

        return db
          .updateItem(itemId, {
            takenByUserId: userId,
            timeTaken: Date.now()
          })
          .then(() => db.log(itemId, userId, LOG_TAKE_ITEM, null))
          .then(() => STATUS_ASSIGN_SUCCESS);
      });
    }

    return STATUS_FAIL;
  });
}

function getItems() {
  return db.getItems();
}

function getUsers() {
  return db.getUsers().then(users =>
    users.map(user => ({
      ...user,
      descriptors: JSON.parse(user.descriptors)
    }))
  );
}

module.exports = {
  getItems,
  getUsers,
  toggleUser,
  addOrUpdateUser
};
