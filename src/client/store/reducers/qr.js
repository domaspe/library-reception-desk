import { QR_DETECT_FAIL, QR_DETECT_SUCCESS } from '../actions';

const initialState = {
  code: '',
  status: null
};

export default function qr(state = initialState, action) {
  switch (action.type) {
    case QR_DETECT_SUCCESS:
      return {
        ...state,
        code: action.code,
        status: QR_DETECT_SUCCESS
      };
    case QR_DETECT_FAIL:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
