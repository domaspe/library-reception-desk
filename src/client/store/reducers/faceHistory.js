import {
  FACE_DETECT_SUCCESS,
  UPDATE_CLASS,
  SAVE_FACE_START,
  UPDATE_CLASS_SUCCESS,
  UPDATE_CLASS_FAIL
} from '../actions';

const initialState = {
  status: '',
  descriptors: []
};

export default function face(state = initialState, action) {
  switch (action.type) {
    case FACE_DETECT_SUCCESS:
      return {
        ...state,
        descriptors:
          state.status === SAVE_FACE_START
            ? [...state.descriptors, action.descriptor]
            : []
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
