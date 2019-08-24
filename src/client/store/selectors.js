import { matchPath } from 'react-router-dom';
import {
  SAVE_FACE_START,
  UPDATE_CLASS,
  FACE_DETECT_SUCCESS,
  LOAD_USERS,
  QR_DETECT_SUCCESS,
  ASSIGN_ITEM_SUCCESS
} from './actions';
import {
  DESCRIPTORS_PER_CLASS,
  PATH_SLEEP,
  PATH_FACE_SCAN,
  PATH_SESSION,
  PATH_NOT_RECOGNIZED,
  PATH_CREATE_USER,
  PATH_HELP
} from '../constants';
import { itemToString } from '../utils/item';

const selectFaceState = state => state.face;
const selectFaceMatchState = state => state.faceMatch;
const selectFaceHistoryState = state => state.faceHistory;
const selectQrState = state => state.qr;
const selectNotifyState = state => state.notify;
const selectScanState = state => state.scan;
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

export function selectFaceHistoryLabel(state) {
  return selectFaceHistoryState(state).label;
}

export function selectIsFaceDetected(state) {
  return selectFaceState(state).status === FACE_DETECT_SUCCESS;
}

export function selectFaceMatchLabel(state) {
  return selectFaceMatchState(state).label;
}

export function selectAllFaceMatchAttemptsFailed(state) {
  return selectFaceMatchState(state).consecutiveFails > 15;
}

export function selectQrCode(state) {
  return selectQrState(state).code;
}

export function selectNotificationMessage(state) {
  return selectNotifyState(state).message;
}

export function selectNotificationKey(state) {
  return selectNotifyState(state).key;
}

export function selectShouldSleepScan(state) {
  return selectScanState(state).sleep;
}

export function selectShouldPauseScan(state) {
  return selectScanState(state).pause;
}

export function selectItems(state) {
  return selectItemsState(state).items.sort(
    (a, b) => new Date(b.dateTaken) - new Date(a.dateTaken)
  );
}

export function selectItemByCode(state, code) {
  return selectItems(state).find(item => String(item.id) === String(code));
}

export function selectUsers(state) {
  return selectUsersState(state).users;
}

export function selectItemLabelByCode(state, code) {
  const item = selectItemByCode(state, code);
  if (!item) {
    return '';
  }

  return itemToString(item);
}

export function selectNotifyAssignItemAuccess(state) {
  const itemsState = selectItemsState(state);
  return (
    itemsState.status === ASSIGN_ITEM_SUCCESS &&
    Date.now() - itemsState.timestamp < 1000
  );
}

export function selectUserItems(state, user) {
  return selectItems(state).filter(item => String(item.user) === String(user));
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

export function selectActiveUserId(state) {
  return selectActiveUserState(state).id;
}
