import {
  combineReducers, createStore,
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import tasksReducer from './tasks';

function lastAction(state = null, action: any) {
  return action;
}

const rootReducer = combineReducers({
  tasks: tasksReducer,
  lastAction,
});

const store = createStore(rootReducer, composeWithDevTools());

export type RootState = ReturnType<typeof rootReducer>

export default store;
