import { NOTIFY } from '../actions';

const initialState = {
  message: '',
  key: null
};

export default function notify(state = initialState, action) {
  switch (action.type) {
    case NOTIFY:
      return { ...state, message: action.message, key: Date.now() };
    default:
      return state;
  }
}
