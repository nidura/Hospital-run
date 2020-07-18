import { combineReducers } from 'redux';
import state from './state.reducer';
import user from './user.reducer';
import contacts from './contacts.reducer';
import chat from './chat.reducer';

const chatPanelReducers = combineReducers({
  state,
  user,
  contacts,
  chat,
});

export default chatPanelReducers;
