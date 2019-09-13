import { fork } from 'redux-saga/effects';
import navigation from './navigation';
import api from './api';
import scan from './scan';

export default function* sagas() {
  yield fork(navigation);
  yield fork(scan);
  yield fork(api);
}
