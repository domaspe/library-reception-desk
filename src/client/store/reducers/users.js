import { LOAD_USERS, LOAD_USERS_SUCCESS } from '../actions';

const initialState = {
  users: [],
  status: null
};

export default function users(state = initialState, action) {
  switch (action.type) {
    case LOAD_USERS:
      return { ...state, status: LOAD_USERS };
    case LOAD_USERS_SUCCESS:
      return { ...state, users: action.users, status: LOAD_USERS_SUCCESS };
    default:
      return state;
  }
}
