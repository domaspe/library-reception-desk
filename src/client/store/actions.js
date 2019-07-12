export const APP_INIT = 'APP_INIT';

export const FACE_DETECT_SUCCESS = 'FACE_DETECT_SUCCESS';
export const FACE_DETECT_FAIL = 'FACE_DETECT_FAIL';
export const FACE_MATCH_SUCCESS = 'FACE_MATCH_SUCCESS';
export const FACE_MATCH_FAIL = 'FACE_MATCH_FAIL';
export const SAVE_FACE_START = 'SAVE_FACE_START';
export const UPDATE_CLASS = 'UPDATE_CLASS';
export const UPDATE_CLASS_SUCCESS = 'UPDATE_CLASS_SUCCESS';
export const UPDATE_CLASS_FAIL = 'UPDATE_CLASS_FAIL';
export const QR_DETECT_SUCCESS = 'QR_DETECT_SUCCESS';
export const QR_DETECT_FAIL = 'QR_DETECT_FAIL';

export const SAVE_FACELESS = 'SAVE_FACELESS';

export const SET_VIEW = 'SET_VIEW';
export const OPEN_USER_PICKER = 'OPEN_USER_PICKER';
export const CLOSE_USER_PICKER = 'CLOSE_USER_PICKER';

export const ASSIGN_ITEM_STARTED = 'ASSIGN_ITEM_STARTED';
export const ASSIGN_ITEM_SUCCESS = 'ASSIGN_ITEM_SUCCESS';
export const ASSIGN_ITEM_FAIL = 'ASSIGN_ITEM_FAIL';

export const LOAD_ITEMS = 'LOAD_ITEMS';
export const LOAD_ITEMS_SUCCESS = 'LOAD_ITEMS_SUCCESS';
export const LOAD_USERS = 'LOAD_USERS';
export const LOAD_USERS_SUCCESS = 'LOAD_USERS_SUCCESS';

export const NOTIFY = 'NOTIFY';

export const SCAN_START = 'SCAN_START';

export const PICK_USER = 'PICK_USER';

export function appInit() {
  return {
    type: APP_INIT
  };
}

export function faceDetectSuccess(descriptor) {
  return {
    type: FACE_DETECT_SUCCESS,
    descriptor
  };
}

export function faceDetectFail() {
  return {
    type: FACE_DETECT_FAIL
  };
}

export function saveFace(label) {
  return {
    type: SAVE_FACE_START,
    label
  };
}

export function saveFaceless(user) {
  return {
    type: SAVE_FACELESS,
    user
  };
}

export function updateClass(label, descriptors) {
  return {
    type: UPDATE_CLASS,
    label,
    descriptors
  };
}

export function updateClassSuccess() {
  return {
    type: UPDATE_CLASS_SUCCESS
  };
}

export function updateClassFail() {
  return {
    type: UPDATE_CLASS_FAIL
  };
}

export function faceMatchSuccess(label) {
  return {
    type: FACE_MATCH_SUCCESS,
    label
  };
}

export function faceMatchFail() {
  return {
    type: FACE_MATCH_FAIL
  };
}

export function qrDetectSuccess(code) {
  return {
    type: QR_DETECT_SUCCESS,
    code
  };
}

export function qrDetectFail() {
  return {
    type: QR_DETECT_FAIL
  };
}

export function setView(view) {
  return {
    type: SET_VIEW,
    view
  };
}

export function assignItemStarted() {
  return {
    type: ASSIGN_ITEM_STARTED
  };
}

export function assignItemSuccess() {
  return {
    type: ASSIGN_ITEM_SUCCESS
  };
}

export function assignItemFail() {
  return {
    type: ASSIGN_ITEM_FAIL
  };
}

export function notify(message) {
  return {
    type: NOTIFY,
    message
  };
}

export function scanStart({ videoRef, faceCanvasRef, qrCanvasRef, mediaWidth, mediaHeight }) {
  return {
    type: SCAN_START,
    videoRef,
    faceCanvasRef,
    qrCanvasRef,
    mediaWidth,
    mediaHeight
  };
}

export function loadItems() {
  return {
    type: LOAD_ITEMS
  };
}

export function loadItemsSuccess(items) {
  return {
    type: LOAD_ITEMS_SUCCESS,
    items
  };
}

export function loadUsers() {
  return {
    type: LOAD_USERS
  };
}

export function loadUsersSuccess(users) {
  return {
    type: LOAD_USERS_SUCCESS,
    users
  };
}

export function pickUser(user) {
  return {
    type: PICK_USER,
    user
  };
}

export function openUserPicker(code) {
  return {
    type: OPEN_USER_PICKER,
    code
  };
}
export function closeUserPicker() {
  return {
    type: CLOSE_USER_PICKER
  };
}
