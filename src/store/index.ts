import {
  combineReducers, createStore,
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import tasksReducer from './tasks';

const rootReducer = combineReducers({
  tasks: tasksReducer,
});

const store = createStore(rootReducer, composeWithDevTools());

export type RootState = ReturnType<typeof rootReducer>

export default store;
