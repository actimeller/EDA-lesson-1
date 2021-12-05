import {
  combineReducers, createStore, compose, applyMiddleware,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import tasksReducer from './tasks';
import rootWatcher from '../saga';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose || compose;

function lastAction(state = null, action: any) {
  return action;
}

const rootReducer = combineReducers({
  tasks: tasksReducer,
  lastAction,
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(rootWatcher);

export type RootState = ReturnType<typeof rootReducer>

export default store;
