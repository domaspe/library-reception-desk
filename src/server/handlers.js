const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const items = require('../../data/defaultItems.json');

const STATUS_SUCCESS = 'STATUS_SUCCESS';
const STATUS_FAIL = 'STATUS_FAIL';

const adapter = new FileSync(
  path.join(__dirname, '../../data', 'database.json')
);
const db = low(adapter);

db.defaults({ users: [], items, descriptors: [] }).write();

const exists = (table, filter) =>
  db
    .get(table)
    .filter(filter)
    .size()
    .value() > 0;

function updateOrAddUser(id) {
  if (!exists('users', { id })) {
    db.get('users')
      .push({ id })
      .write();
  }
}

function updateUserInItem(id, user) {
  db.get('items')
    .find({ id })
    .assign({ user })
    .write();
}

function updateOrAddDescriptors(label, descriptors) {
  db.get('descriptors')
    .remove({ label })
    .write();
  db.get('descriptors')
    .push({ label, descriptors })
    .write();

  updateOrAddUser(label);
}

function getDescriptors() {
  return db.get('descriptors').value();
}

function clearUserFromItem(id) {
  const itemExists = exists('items', { id });

  if (!itemExists) {
    return null;
  }

  const item = db
    .get('items')
    .find({ id })
    .value();

  if (item.user) {
    updateUserInItem(id, null);
    console.log('success');
    return STATUS_SUCCESS;
  }

  return null;
}

function setUserInItem(id, user) {
  const itemExists = exists('items', { id });
  if (!itemExists) {
    return STATUS_FAIL;
  }

  // assign
  const userExists = exists('users', { id: user });
  if (userExists) {
    updateUserInItem(id, user);
    return STATUS_SUCCESS;
  }

  return STATUS_FAIL;
}

function getItems() {
  return db.get('items').value();
}

function getUsers() {
  return db.get('users').value();
}

module.exports = {
  updateOrAddDescriptors,
  getDescriptors,
  getItems,
  updateOrAddUser,
  setUserInItem,
  clearUserFromItem,
  getUsers,
  STATUS_SUCCESS,
  STATUS_FAIL
};
