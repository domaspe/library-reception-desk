const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const items = require('../../data/defaultItems.json');

const STATUS_SUCCESS = 'STATUS_SUCCESS';
const STATUS_FAIL = 'STATUS_FAIL';

const dataPath = path.join(__dirname, '../../data');

const adapter = new FileSync(path.join(dataPath, 'database.json'));
const db = low(adapter);

db.defaults({ users: [], items, descriptors: [] }).write();

const exists = (table, filter) =>
  db
    .get(table)
    .filter(filter)
    .size()
    .value() > 0;

function reloadDatabase() {
  db.read();
}

function updateOrAddUser(id) {
  if (!exists('users', { id })) {
    db.get('users')
      .push({ id })
      .write();
  }
}

function updateAssignment(itemId, user) {
  db.get('items')
    .find({ id: itemId })
    .assign({ user, dateTaken: user ? Date.now() : null })
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

function getItem(itemId) {
  const itemExists = exists('items', { id: itemId });

  if (!itemExists) {
    return null;
  }

  return db
    .get('items')
    .find({ id: itemId })
    .value();
}

function unassignUser(itemId) {
  const item = getItem(itemId);

  if (!item) {
    return null;
  }

  if (item.user) {
    updateAssignment(itemId, null);
    console.log('success');
    return STATUS_SUCCESS;
  }

  return STATUS_FAIL;
}

function assignUser(itemId, user) {
  const itemExists = exists('items', { id: itemId });
  if (!itemExists) {
    return STATUS_FAIL;
  }

  // assign
  const userExists = exists('users', { id: user });
  if (userExists) {
    updateAssignment(itemId, user);
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
  reloadDatabase,
  getDescriptors,
  getItems,
  updateOrAddDescriptors,
  assignUser,
  updateOrAddUser,
  unassignUser,
  getUsers,
  STATUS_SUCCESS,
  STATUS_FAIL
};
