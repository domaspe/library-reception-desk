export const APP_INIT = 'APP_INIT';

export const FACE_DETECT_SUCCESS = 'FACE_DETECT_SUCCESS';
export const FACE_DETECT_FAIL = 'FACE_DETECT_FAIL';
export const FACE_MATCH_SUCCESS = 'FACE_MATCH_SUCCESS';
export const FACE_MATCH_FAIL = 'FACE_MATCH_FAIL';
export const SAVE_FACE_START = 'SAVE_FACE_START';
export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAIL = 'UPDATE_USER_FAIL';
export const QR_DETECT_SUCCESS = 'QR_DETECT_SUCCESS';
export const QR_DETECT_FAIL = 'QR_DETECT_FAIL';

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

export const SET_ACTIVE_USER = 'SET_ACTIVE_USER';
export const CLEAR_ACTIVE_USER = 'CLEAR_ACTIVE_USER';

export const INITIALIZE_SCANNERS = 'INITIALIZE_SCANNERS';

export const TRY_ASSIGN_ITEM = 'TRY_ASSIGN_ITEM';

export const LOAD_STATISTICS = 'LOAD_STATISTICS';
export const LOAD_STATISTICS_SUCCESS = 'LOAD_STATISTICS_SUCCESS';

export const START_SESSION = 'START_SESSION';
export const END_SESSION = 'END_SESSION';
export const START_SCANNING_FACES = 'START_SCANNING_FACES';
export const FACE_NOT_RECOGNIZED = 'FACE_NOT_RECOGNIZED';
export const HIBERNATE = 'HIBERNATE';
export const CREATE_USER = 'CREATE_USER';
export const HELP = 'HELP';
export const SET_ITEMS_DRAWER_STATE = 'SET_ITEMS_DRAWER_STATE';

export const NOTIFY = 'NOTIFY';
export const ERROR = 'ERROR';

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

export function saveFace(name, withFace) {
  return {
    type: SAVE_FACE_START,
    name,
    withFace
  };
}

export function updateUser(name, descriptors) {
  return {
    type: UPDATE_USER,
    name,
    descriptors
  };
}

export function updateUserSuccess(users) {
  return {
    type: UPDATE_USER_SUCCESS,
    users
  };
}

export function updateUserFail() {
  return {
    type: UPDATE_USER_FAIL
  };
}

export function faceMatchSuccess(label, distance) {
  return {
    type: FACE_MATCH_SUCCESS,
    label,
    distance
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

export function scanStart({ videoRef, faceCanvasRef, qrCanvasRef }) {
  return {
    type: INITIALIZE_SCANNERS,
    videoRef,
    faceCanvasRef,
    qrCanvasRef
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

export function tryAssignItem(itemId, userId = null) {
  return {
    type: TRY_ASSIGN_ITEM,
    itemId: Number(itemId),
    userId
  };
}

export function setActiveUser(id) {
  return {
    type: SET_ACTIVE_USER,
    id
  };
}

export function clearActiveUser() {
  return {
    type: CLEAR_ACTIVE_USER
  };
}

export function endSession() {
  return {
    type: END_SESSION
  };
}

export function startSession(userId) {
  return {
    type: START_SESSION,
    userId
  };
}

export function hibernate(userId) {
  return {
    type: HIBERNATE,
    userId
  };
}

export function startScanningFaces() {
  return {
    type: START_SCANNING_FACES
  };
}

export function faceNotRecognized() {
  return {
    type: FACE_NOT_RECOGNIZED
  };
}

export function createUser() {
  return {
    type: CREATE_USER
  };
}

export function help() {
  return {
    type: HELP
  };
}

export function loadStatistics() {
  return {
    type: LOAD_STATISTICS
  };
}

export function loadStatisticsSuccess(mostPopularItems, mostUnpopularItems, mostActiveUsers) {
  return {
    type: LOAD_STATISTICS_SUCCESS,
    mostPopularItems,
    mostUnpopularItems,
    mostActiveUsers
  };
}

export function setItemsDrawerOpen(open) {
  return {
    type: SET_ITEMS_DRAWER_STATE,
    open
  };
}

export function error(message) {
  return {
    type: ERROR,
    message
  };
}

export function notify(message) {
  return {
    type: NOTIFY,
    message
  };
}
