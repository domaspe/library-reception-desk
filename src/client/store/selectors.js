import { matchPath } from 'react-router-dom';
import {
  SAVE_FACE_START,
  FACE_DETECT_SUCCESS,
  LOAD_USERS,
  ASSIGN_ITEM_SUCCESS,
  UPDATE_USER
} from './actions';
import {
  DESCRIPTORS_PER_CLASS,
  PATH_SLEEP,
  PATH_FACE_SCAN,
  PATH_SESSION,
  PATH_NOT_RECOGNIZED,
  PATH_CREATE_USER,
  PATH_HELP,
  MAX_CONSECUTIVER_FAILED_MATCH_ATTEMPTS,
  MAX_CONSECUTIVER_FAILED_DETECT_ATTEMPTS
} from '../constants';

const selectFaceState = state => state.face;
const selectFaceMatchState = state => state.faceMatch;
const selectFaceHistoryState = state => state.faceHistory;
const selectQrState = state => state.qr;
const selectItemsState = state => state.items;
const selectUsersState = state => state.users;
const selectActiveUserState = state => state.activeUser;
const selectRouterState = state => state.router;

export function selectIsFaceHistoryReady(state) {
  return (
    selectFaceHistoryState(state).descriptors.length >= DESCRIPTORS_PER_CLASS
  );
}

export function selectIsReadingFace(state) {
  return selectFaceHistoryState(state).status === SAVE_FACE_START;
}

export function selectIsUpdatingUser(state) {
  return selectFaceHistoryState(state).status === UPDATE_USER;
}

export function selectIsSavingFace(state) {
  return selectIsReadingFace(state) || selectIsUpdatingUser(state);
}

export function selectIsLoadingUsers(state) {
  return selectUsersState(state).status === LOAD_USERS;
}

export function selectFaceDataCollectedPercentage(state) {
  return selectIsSavingFace(state)
    ? (selectFaceHistoryState(state).descriptors.length /
        DESCRIPTORS_PER_CLASS) *
        100
    : 0;
}

export function selectFaceHistoryDescriptors(state) {
  return selectFaceHistoryState(state).descriptors;
}

export function selectIsFaceDetected(state) {
  return selectFaceState(state).status === FACE_DETECT_SUCCESS;
}

export function selectFaceCannotBeMatched(state) {
  return (
    selectFaceMatchState(state).consecutiveFails >
    MAX_CONSECUTIVER_FAILED_MATCH_ATTEMPTS
  );
}

export function selectFaceMissingForHistory(state) {
  return (
    selectFaceHistoryState(state).consecutiveFails >
    MAX_CONSECUTIVER_FAILED_DETECT_ATTEMPTS
  );
}

export function selectQrCode(state) {
  return selectQrState(state).code;
}

export function selectUsers(state) {
  return selectUsersState(state).users;
}

export function selectItems(state, sortBy = 'timeTaken') {
  const { items } = selectItemsState(state);
  let sorted = items;
  if (sortBy === 'timeTaken') {
    sorted = items.sort(
      (a, b) => new Date(b.timeTaken) - new Date(a.timeTaken)
    );
  }

  if (sortBy === 'title') {
    sorted = items.sort((a, b) => {
      if (a.primaryTitle > b.primaryTitle) return 1;
      if (a.primaryTitle < b.primaryTitle) return -1;
      if (a.secondaryTitle > b.secondaryTitle) return 1;
      if (a.secondaryTitle < b.secondaryTitle) return -1;
      return 0;
    });
  }

  const users = selectUsers(state);
  return sorted.map(item => ({
    ...item,
    user: users.find(user => user.id === item.takenByUserId) || null
  }));
}

export function selectClassesLoaded(state) {
  return selectUsers(state).length > 0;
}

export function selectClasses(state) {
  return selectUsers(state)
    .filter(user => user.descriptors)
    .map(user => ({
      label: user.id.toString(),
      descriptors: user.descriptors
    }));
}

export function selectNotifyAssignItemSuccess(state) {
  const itemsState = selectItemsState(state);
  return (
    itemsState.status === ASSIGN_ITEM_SUCCESS &&
    Date.now() - itemsState.timestamp < 1000
  );
}

export function selectUserItems(state, user, sortBy) {
  return selectItems(state, sortBy).filter(
    item => String(item.takenByUserId) === String(user)
  );
}

export function selectUserHasItem(state, user, itemId) {
  return !!selectUserItems(state, user).find(item => item.id === itemId);
}

export function selectFreeItems(state, sortBy) {
  return selectItems(state, sortBy).filter(item => !item.timeTaken);
}

function selectPathname(state) {
  const { pathname } = selectRouterState(state).location;
  return pathname;
}

export function selectIsHibernatedPage(state) {
  return !!matchPath(selectPathname(state), { path: PATH_SLEEP });
}

export function selectIsFaceScanPage(state) {
  const pathname = selectPathname(state);
  return !!matchPath(pathname, { path: PATH_FACE_SCAN }) || pathname === '/';
}

export function selectIsSessionPage(state) {
  return !!matchPath(selectPathname(state), { path: PATH_SESSION });
}

export function selectIsNotRecognizedPage(state) {
  return !!matchPath(selectPathname(state), { path: PATH_NOT_RECOGNIZED });
}

export function selectIsCreateUserPage(state) {
  return !!matchPath(selectPathname(state), { path: PATH_CREATE_USER });
}

export function selectIsHelpPage(state) {
  return !!matchPath(selectPathname(state), { path: PATH_HELP });
}

export function selectIsItemsDrawerOpen(state) {
  return state.itemsDrawer.open;
}

export function selectActiveUserId(state) {
  return selectActiveUserState(state).id;
}

export function selectActiveUser(state) {
  const userId = selectActiveUserId(state);
  return selectUsers(state).find(user => user.id === userId);
}
