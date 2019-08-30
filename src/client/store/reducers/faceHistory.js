import {
  FACE_DETECT_SUCCESS,
  SAVE_FACE_START,
  FACE_DETECT_FAIL,
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL
} from '../actions';

const initialState = {
  status: '',
  consecutiveFails: 0,
  descriptors: []
};

const isSavingFace = status => status === SAVE_FACE_START;

export default function face(state = initialState, action) {
  switch (action.type) {
    case FACE_DETECT_SUCCESS:
      return {
        ...state,
        consecutiveFails: 0,
        descriptors: isSavingFace(state.status)
          ? [...state.descriptors, action.descriptor]
          : []
      };
    case FACE_DETECT_FAIL:
      return {
        ...state,
        consecutiveFails: isSavingFace(state.status)
          ? state.consecutiveFails + 1
          : 0
      };
    case UPDATE_USER:
      return {
        ...state,
        status: UPDATE_USER
      };
    case UPDATE_USER_SUCCESS:
    case UPDATE_USER_FAIL:
      return {
        ...state,
        consecutiveFails: 0,
        status: action.type,
        descriptors: []
      };
    case SAVE_FACE_START:
      return {
        ...state,
        status: SAVE_FACE_START,
        descriptors: []
      };
    default:
      return state;
  }
}
