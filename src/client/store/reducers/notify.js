import { NOTIFY } from '../actions';

const initialState = {
  message: ''
};

export default function notification(state = initialState, action) {
  switch (action.type) {
    case NOTIFY:
      return { ...state, message: action.message };
    default:
      return state;
  }
}
