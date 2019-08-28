import { matchPath } from 'react-router-dom';
import {
  SAVE_FACE_START,
  UPDATE_CLASS,
  FACE_DETECT_SUCCESS,
  LOAD_USERS,
  ASSIGN_ITEM_SUCCESS
} from './actions';
import {
  DESCRIPTORS_PER_CLASS,
  PATH_SLEEP,
  PATH_FACE_SCAN,
  PATH_SESSION,
  PATH_NOT_RECOGNIZED,
  PATH_CREATE_USER,
  PATH_HELP,
  MAX_CONSECUTIVER_FAILED_MATCH_ATTEMPTS
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

export function selectIsSavingFace(state) {
  return (
    selectFaceHistoryState(state).status === SAVE_FACE_START ||
    selectFaceHistoryState(state).status === UPDATE_CLASS
  );
}

export function selectIsUpdatingClass(state) {
  return selectFaceHistoryState(state).status === UPDATE_CLASS;
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
    MAX_CONSECUTIVER_FAILED_MATCH_ATTEMPTS
  );
}

export function selectQrCode(state) {
  return selectQrState(state).code;
}

export function selectItems(state, sortBy = 'dateTaken') {
  const { items } = selectItemsState(state);
  if (sortBy === 'dateTaken') {
    return items.sort((a, b) => new Date(b.dateTaken) - new Date(a.dateTaken));
  }

  if (sortBy === 'title') {
    return items.sort((a, b) => {
      if (a.primaryTitle > b.primaryTitle) return 1;
      if (a.primaryTitle < b.primaryTitle) return -1;
      if (a.secondaryTitle > b.secondaryTitle) return 1;
      if (a.secondaryTitle < b.secondaryTitle) return -1;
      return 0;
    });
  }

  return items;
}

export function selectUsers(state) {
  return selectUsersState(state).users;
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
    item => String(item.user) === String(user)
  );
}

export function selectUserHasItem(state, user, itemId) {
  return !!selectUserItems(state, user).find(item => item.id === itemId);
}

export function selectFreeItems(state, sortBy) {
  return selectItems(state, sortBy).filter(item => !item.dateTaken);
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
