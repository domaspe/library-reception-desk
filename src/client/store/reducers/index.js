import { combineReducers } from 'redux';
import face from './face';
import faceHistory from './faceHistory';
import faceMatch from './faceMatch';
import qr from './qr';
import view from './view';
import notify from './notify';
import items from './items';
import users from './users';

export default combineReducers({
  face,
  faceHistory,
  faceMatch,
  qr,
  view,
  notify,
  items,
  users
});
