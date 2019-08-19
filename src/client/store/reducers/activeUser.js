import { SET_ACTIVE_USER, CLEAR_ACTIVE_USER } from '../actions';

const initialState = {
  id: ''
};

export default function users(state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVE_USER:
      return { ...state, id: action.id };
    case CLEAR_ACTIVE_USER:
      return { ...state, id: '' };
    default:
      return state;
  }
}
