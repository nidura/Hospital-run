import { combineReducers } from 'redux';
import sidebars from './sidebars.reducer';
import user from './user.reducer';
import contacts from './contacts.reducer';
import chat from './chat.reducer';

const chatAppReducers = combineReducers({
  sidebars,
  user,
  contacts,
  chat,
});

export default chatAppReducers;
