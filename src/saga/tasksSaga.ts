import {
  put, takeEvery, call, all,
} from 'redux-saga/effects';
import { ASYNC_SET_TASKS } from '../store/tasks/types';

import {
  getSessionUser, deleteTask, setTask, setUser,
} from '../api/storage';
import { AsyncSetTasks, updateTasks } from '../store/tasks/actions';
import { User } from '../api';

function* asyncSetTasks(props: AsyncSetTasks) {
  const { sessionId, snapshotTasks } = props.payload;

  const user: User = yield call(getSessionUser, sessionId);
  const userTasksIds: string [] = user.tasks;
  yield all(userTasksIds.map((id) => call(deleteTask, id)));
  yield all(snapshotTasks.map((task) => call(setTask, task)));
  yield call(setUser, { ...user, tasks: snapshotTasks.map((task) => task.id) });
  yield put(updateTasks());
}

export function* userWatcher() {
  yield takeEvery(ASYNC_SET_TASKS, asyncSetTasks);
}

export default {};
