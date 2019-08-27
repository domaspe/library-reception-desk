import {
  FACE_DETECT_SUCCESS,
  UPDATE_CLASS,
  SAVE_FACE_START,
  UPDATE_CLASS_SUCCESS,
  UPDATE_CLASS_FAIL,
  FACE_DETECT_FAIL
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
    case UPDATE_CLASS:
      return {
        ...state,
        status: UPDATE_CLASS
      };
    case UPDATE_CLASS_SUCCESS:
    case UPDATE_CLASS_FAIL:
      return {
        ...state,
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
