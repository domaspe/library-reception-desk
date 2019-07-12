import { LOAD_ITEMS, LOAD_ITEMS_SUCCESS } from '../actions';

const initialState = {
  items: [],
  status: null
};

export default function items(state = initialState, action) {
  switch (action.type) {
    case LOAD_ITEMS:
      return { ...state, status: LOAD_ITEMS };
    case LOAD_ITEMS_SUCCESS:
      return { ...state, items: action.items, status: LOAD_ITEMS_SUCCESS };
    default:
      return state;
  }
}
