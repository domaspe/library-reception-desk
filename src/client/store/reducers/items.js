import {
  LOAD_ITEMS,
  LOAD_ITEMS_SUCCESS,
  ASSIGN_ITEM_SUCCESS,
  ASSIGN_ITEM_STARTED
} from '../actions';

const initialState = {
  items: [],
  status: null,
  statusTime: null
};

export default function items(state = initialState, action) {
  switch (action.type) {
    case LOAD_ITEMS:
      return { ...state, status: LOAD_ITEMS, timestamp: Date.now() };
    case LOAD_ITEMS_SUCCESS:
      return {
        ...state,
        items: action.items.map(item => ({
          ...item,
          stringified: `${item.primaryTitle} ${item.secondaryTitle}`.toLowerCase()
        })),
        status: LOAD_ITEMS_SUCCESS,
        timestamp: Date.now()
      };
    case ASSIGN_ITEM_STARTED:
      return { ...state, status: ASSIGN_ITEM_STARTED, timestamp: Date.now() };
    case ASSIGN_ITEM_SUCCESS:
      return { ...state, status: ASSIGN_ITEM_SUCCESS, timestamp: Date.now() };
    default:
      return state;
  }
}
