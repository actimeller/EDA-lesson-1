import * as types from './types';
import { Task } from '../../api';
import { ActionTypes } from './actions';
import { isTodayTask } from '../../utils';

type InitialState = {
  tasks: Task[],
  todayTasks: Task[]
};

const initialState:InitialState = {
  tasks: [],
  todayTasks: [],
};

const reducer = (state = initialState, action: ActionTypes): InitialState => {
  switch (action.type) {
    case types.SET_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };
    case types.SET_TODAY_TASKS:
      return {
        ...state,
        todayTasks: action.payload.filter((task) => isTodayTask(task)),
      };
    case types.UPDATE_TASKS:
      return {
        ...state,
        tasks: [...state.tasks],
      };

    default:
      return state;
  }
};

export default reducer;
