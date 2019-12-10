import { matchPath } from 'react-router-dom';
import { createSelector } from 'reselect';
import {
  SAVE_FACE_START,
  FACE_DETECT_SUCCESS,
  LOAD_USERS,
  ASSIGN_ITEM_SUCCESS,
  UPDATE_USER,
  LOAD_STATISTICS
} from './actions';
import {
  DESCRIPTORS_PER_CLASS,
  PATH_SLEEP,
  PATH_FACE_SCAN,
  PATH_SESSION,
  PATH_NOT_RECOGNIZED,
  PATH_CREATE_USER,
  PATH_HELP,
  MAX_CONSECUTIVE_FAILED_MATCH_ATTEMPTS,
  MAX_CONSECUTIVE_FAILED_DETECT_ATTEMPTS,
  MIN_CONSECUTIVE_MATCHES,
  PATH_NOTIFY
} from '../constants';

const selectFaceState = state => state.face;
const selectFaceMatchState = state => state.faceMatch;
const selectFaceHistoryState = state => state.faceHistory;
const selectQrState = state => state.qr;
const selectItemsState = state => state.items;
const selectUsersState = state => state.users;
const selectActiveUserState = state => state.activeUser;
const selectRouterState = state => state.router;
const selectStatisticsState = state => state.statistics;

const sortByKey = key => (a, b) => (a[key] > b[key] ? 1 : -1);
const sortByTime = key => (a, b) => new Date(b[key]) - new Date(a[key]);

export function selectFaceHistoryDescriptors(state) {
  const { descriptors } = selectFaceHistoryState(state);
  return descriptors.slice(0, 10);
}

export function selectIsFaceHistoryReady(state) {
  return selectFaceHistoryDescriptors(state).length >= DESCRIPTORS_PER_CLASS;
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
    ? (selectFaceHistoryDescriptors(state).length / DESCRIPTORS_PER_CLASS) * 100
    : 0;
}

export function selectIsFaceDetected(state) {
  return selectFaceState(state).status === FACE_DETECT_SUCCESS;
}

export function selectFaceCannotBeMatched(state) {
  return selectFaceMatchState(state).consecutiveFails > MAX_CONSECUTIVE_FAILED_MATCH_ATTEMPTS;
}

export function selectFaceMissingForHistory(state) {
  return selectFaceHistoryState(state).consecutiveFails > MAX_CONSECUTIVE_FAILED_DETECT_ATTEMPTS;
}

export function selectIsEnoughConsecutiveMatchSuccesses(state) {
  return selectFaceMatchState(state).consecutiveSuccess >= MIN_CONSECUTIVE_MATCHES;
}

export function selectQrCode(state) {
  return selectQrState(state).code;
}

export function selectUsers(state) {
  return selectUsersState(state).users;
}

export function selectActiveUserId(state) {
  return selectActiveUserState(state).id;
}

export function selectActiveUser(state) {
  const userId = selectActiveUserId(state);
  return selectUsers(state).find(user => user.id === userId);
}

export const selectItemsStateItems = createSelector(
  selectItemsState,
  selectUsers,
  (itemsState, users) => {
    return itemsState.items.map(item => ({
      ...item,
      takenByUser: users.find(user => user.id === item.takenByUserId)
    }));
  }
);

export const selectItemsStateItemsSortedByTime = createSelector(selectItemsStateItems, items =>
  [...items].sort(sortByTime('timeTaken'))
);

export const selectItemsStateItemsSortedByTitle = createSelector(selectItemsStateItems, items => {
  return [...items].sort(sortByKey('stringified'));
});

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
  return itemsState.status === ASSIGN_ITEM_SUCCESS && Date.now() - itemsState.timestamp < 1000;
}

export const selectUserItems = createSelector(
  selectItemsStateItemsSortedByTime,
  selectActiveUserId,
  (items, userId) => items.filter(item => String(item.takenByUserId) === String(userId))
);

export const selectFreeItems = createSelector(selectItemsStateItemsSortedByTitle, items =>
  items.filter(item => !item.timeTaken)
);

export const selectTakenItems = createSelector(selectItemsStateItemsSortedByTitle, items =>
  items.filter(item => item.timeTaken)
);

const selectFilteredItems = (filterPhrase, items) => {
  const filter = filterPhrase.trim().toLowerCase();
  if (!filter || filter.length < 2) {
    return items;
  }

  const filteredItems = filter
    .split(' ')
    .filter(word => word)
    .flatMap(word => items.filter(item => item.stringified.indexOf(word) >= 0));

  return filteredItems;
};

export const createFreeItemsFilterSelector = createSelector(selectFreeItems, freeItems => filter =>
  selectFilteredItems(filter, freeItems)
);

export const createTakenItemsFilterSelector = createSelector(selectTakenItems, items => {
  return filter => {
    return selectFilteredItems(filter, items);
  };
});

function selectPathname(state) {
  const { pathname } = selectRouterState(state).location;
  return pathname;
}

export function selectSearch(state) {
  const { search } = selectRouterState(state).location;
  return search;
}

export const selectIsHibernatedPage = createSelector(
  selectPathname,
  pathname => !!matchPath(pathname, { path: PATH_SLEEP })
);

export const selectIsFaceScanPagePaused = createSelector(
  selectPathname,
  selectSearch,
  (pathname, search) => {
    return (
      search === '?pause' && (!!matchPath(pathname, { path: PATH_FACE_SCAN }) || pathname === '/')
    );
  }
);

export const selectIsFaceScanPage = createSelector(
  selectPathname,
  pathname => !!matchPath(pathname, { path: PATH_FACE_SCAN }) || pathname === '/'
);

export const selectIsSessionPage = createSelector(
  selectPathname,
  pathname => !!matchPath(pathname, { path: PATH_SESSION })
);

export const selectIsNotRecognizedPage = createSelector(
  selectPathname,
  pathname => !!matchPath(pathname, { path: PATH_NOT_RECOGNIZED })
);

export const selectIsCreateUserPage = createSelector(
  selectPathname,
  pathname => !!matchPath(pathname, { path: PATH_CREATE_USER })
);

export const selectIsHelpPage = createSelector(
  selectPathname,
  pathname => !!matchPath(pathname, { path: PATH_HELP })
);

export const selectIsNotifyPage = createSelector(
  selectPathname,
  pathname => !!matchPath(pathname, { path: PATH_NOTIFY })
);

export function selectIsNotifyMessage(state) {
  return state.notify.message;
}

export function selectIsItemsDrawerOpen(state) {
  return state.itemsDrawer.open;
}

export function selectIsLoadStatisticsInProgress(state) {
  const { status } = selectStatisticsState(state);
  return status === LOAD_STATISTICS || !status;
}

export function selectMostPopularItems(state) {
  return selectStatisticsState(state).mostPopularItems;
}

export function selectMostUnpopularItems(state) {
  return selectStatisticsState(state).mostUnpopularItems;
}

export function selectMostActiveUsers(state) {
  return selectStatisticsState(state).mostActiveUsers;
}
