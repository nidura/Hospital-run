import { combineReducers } from 'redux';
import auth from 'auth/store/reducers/index';
import quickPanel from 'main/quickPanel/store/reducers';
import chatPanel from 'main/chatPanel/store/reducers';
import fuse from './fuse';

const rootReducer = combineReducers({
  auth,
  fuse,
  quickPanel,
  chatPanel,
});

export default rootReducer;
