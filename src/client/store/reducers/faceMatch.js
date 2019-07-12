import {
  FACE_MATCH_SUCCESS,
  FACE_MATCH_FAIL,
  FACE_DETECT_FAIL
} from '../actions';

const initialState = {
  label: ''
};

export default function faceMatch(state = initialState, action) {
  switch (action.type) {
    case FACE_MATCH_SUCCESS:
      return {
        ...state,
        label: action.label
      };
    case FACE_DETECT_FAIL:
    case FACE_MATCH_FAIL:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
