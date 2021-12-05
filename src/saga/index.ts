import { all } from 'redux-saga/effects';
import { userWatcher } from './tasksSaga';

export default function* rootWatcher() {
  yield all([userWatcher()]);
}
