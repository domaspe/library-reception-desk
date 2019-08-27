import { FACE_DETECT_SUCCESS, FACE_DETECT_FAIL } from '../actions';

const initialState = {
  status: '',
  consecutiveFails: 0
};

export default function face(state = initialState, action) {
  switch (action.type) {
    case FACE_DETECT_SUCCESS:
      return {
        ...state,
        status: FACE_DETECT_SUCCESS
      };
    case FACE_DETECT_FAIL:
      return {
        ...state,
        status: FACE_DETECT_FAIL
      };
    default:
      return state;
  }
}
