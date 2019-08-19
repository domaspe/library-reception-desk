import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import face from './face';
import faceHistory from './faceHistory';
import faceMatch from './faceMatch';
import qr from './qr';
import notify from './notify';
import items from './items';
import users from './users';
import activeUser from './activeUser';

import history from '../../utils/history';

export default combineReducers({
  router: connectRouter(history),
  face,
  faceHistory,
  faceMatch,
  qr,
  notify,
  items,
  users,
  activeUser
});
