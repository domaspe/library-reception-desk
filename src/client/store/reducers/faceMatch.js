import {
  FACE_MATCH_SUCCESS,
  FACE_MATCH_FAIL,
  FACE_DETECT_FAIL,
  FACE_NOT_RECOGNIZED,
  START_SESSION
} from '../actions';

const initialState = {
  label: '',
  consecutiveFails: 0,
  consecutiveSuccess: 0
};

export default function faceMatch(state = initialState, action) {
  switch (action.type) {
    case FACE_DETECT_FAIL:
      return {
        ...state,
        label: '',
        consecutiveFails: 0,
        consecutiveSuccess: 0
      };
    case FACE_MATCH_SUCCESS:
      return {
        ...state,
        label: action.label,
        consecutiveSuccess: action.label === state.label ? state.consecutiveSuccess + 1 : 0,
        consecutiveFails: 0
      };
    case FACE_MATCH_FAIL:
      return {
        ...state,
        label: '',
        consecutiveFails: state.consecutiveFails + 1,
        consecutiveSuccess: 0
      };
    case START_SESSION:
    case FACE_NOT_RECOGNIZED:
      return {
        label: '',
        consecutiveFails: 0,
        consecutiveSuccess: 0
      };
    default:
      return state;
  }
}
