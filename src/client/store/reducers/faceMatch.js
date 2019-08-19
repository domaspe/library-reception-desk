import {
  FACE_MATCH_SUCCESS,
  FACE_MATCH_FAIL,
  FACE_DETECT_FAIL
} from '../actions';

const initialState = {
  label: '',
  consecutiveFails: 0
};

export default function faceMatch(state = initialState, action) {
  switch (action.type) {
    case FACE_DETECT_FAIL:
      return {
        ...state,
        label: '',
        consecutiveFails: 0
      };
    case FACE_MATCH_SUCCESS:
      return {
        ...state,
        label: action.label,
        consecutiveFails: 0
      };
    case FACE_MATCH_FAIL:
      return {
        ...state,
        label: '',
        consecutiveFails: state.consecutiveFails + 1
      };
    default:
      return state;
  }
}
