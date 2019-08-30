const db = require('./database.js');

const STATUS_ASSIGN_SUCCESS = 'STATUS_ASSIGN_SUCCESS';
const STATUS_UNASSIGN_SUCCESS = 'STATUS_UNASSIGN_SUCCESS';
const STATUS_FAIL = 'STATUS_FAIL';

async function addOrUpdateUser(id, name, descriptors) {
  if (!name) {
    return new Error('Name is not provided');
  }

  const sameUser = await db.getUserByName(name);
  if (sameUser) {
    return db.updateUser(sameUser.id, {
      name,
      descriptors: descriptors ? JSON.stringify(descriptors) : null
    });
  }
  return db.addUser(name, descriptors ? JSON.stringify(descriptors) : null);
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
