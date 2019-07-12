import { SET_VIEW, OPEN_USER_PICKER, CLOSE_USER_PICKER } from '../actions';
import { MAIN_VIEW } from '../../constants';

const initialState = {
  view: MAIN_VIEW,
  userPickerCode: null
};

export default function view(state = initialState, action) {
  switch (action.type) {
    case SET_VIEW:
      return { ...state, view: action.view };
    case OPEN_USER_PICKER:
      return { ...state, userPickerCode: action.code };
    case CLOSE_USER_PICKER:
      return { ...state, userPickerCode: null };
    default:
      return state;
  }
}
