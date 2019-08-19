import { select, take } from 'redux-saga/effects';

export function* waitFor(selector, expectedResult = true) {
  if (yield select(selector) === expectedResult) return expectedResult; // (1)

  while (true) {
    yield take('*'); // (1a)
    const result = yield select(selector);
    if (result === expectedResult) return result; // (1b)
  }
}
