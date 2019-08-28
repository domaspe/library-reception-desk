import {
  SET_ITEMS_DRAWER_STATE,
  HIBERNATE,
  START_SCANNING_FACES,
  START_SESSION
} from '../actions';

const initialState = {
  open: false
};

export default function users(state = initialState, action) {
  switch (action.type) {
    case SET_ITEMS_DRAWER_STATE:
      return { ...state, open: action.open };
    case START_SCANNING_FACES:
    case HIBERNATE:
      return { ...state, open: false };
    default:
      return state;
  }
}
