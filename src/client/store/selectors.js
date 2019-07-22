import { SAVE_FACE_START, UPDATE_CLASS, FACE_DETECT_SUCCESS } from './actions';
import { DESCRIPTORS_PER_CLASS } from '../constants';
import { itemToString } from '../utils/item';

const selectFaceState = state => state.face;
const selectFaceMatchState = state => state.faceMatch;
const selectFaceHistoryState = state => state.faceHistory;
const selectQrState = state => state.qr;
const selectViewState = state => state.view;
const selectNotifyState = state => state.notify;
const selectScanState = state => state.scan;
const selectItemsState = state => state.items;
const selectUsersState = state => state.users;

export function selectIsFaceHistoryReady(state) {
  return (
    selectFaceHistoryState(state).descriptors.length >= DESCRIPTORS_PER_CLASS
  );
}

export function selectIsSavingFace(state) {
  return selectFaceHistoryState(state).status === SAVE_FACE_START;
}

export function selectIsNotSavingFace(state) {
  return selectFaceHistoryState(state).status !== SAVE_FACE_START;
}

export function selectIsUpdatingClass(state) {
  return selectFaceHistoryState(state).status === UPDATE_CLASS;
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

export function selectQrCode(state) {
  return selectQrState(state).code;
}

export function selectCurrentView(state) {
  return selectViewState(state).view;
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
  return selectItemsState(state).items;
}

export function selectItemByCode(state, code) {
  return selectItems(state).find(item => String(item.id) === String(code));
}

export function selectUsers(state) {
  return selectUsersState(state).users;
}

export function selectUserPickerCode(state) {
  return selectViewState(state).userPickerCode;
}

export function selectIsUserPickerOpen(state) {
  return !!selectUserPickerCode(state);
}

export function selectItemLabelByCode(state, code) {
  const item = selectItemByCode(state, code);
  if (!item) {
    return '';
  }

  return itemToString(item);
}

export function selectUserPickerTitle(state) {
  const code = selectUserPickerCode(state);
  return selectItemLabelByCode(state, code);
}
