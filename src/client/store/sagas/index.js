import { fork } from 'redux-saga/effects';
import navigation from './navigation';
import other from './other';
import scan from './scan';

export default function* sagas() {
  yield fork(navigation);
  yield fork(other);
  yield fork(scan);
}
