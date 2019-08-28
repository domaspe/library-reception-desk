import { fork } from 'redux-saga/effects';
import navigation from './navigation';
import save from './save';
import scan from './scan';

export default function* sagas() {
  yield fork(navigation);
  yield fork(scan);
  yield fork(save);
}
