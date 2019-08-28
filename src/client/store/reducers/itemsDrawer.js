import { SET_ITEMS_DRAWER_STATE } from '../actions';

const initialState = {
  open: false
};

export default function users(state = initialState, action) {
  switch (action.type) {
    case SET_ITEMS_DRAWER_STATE:
      return { ...state, open: action.open };
    default:
      return state;
  }
}
