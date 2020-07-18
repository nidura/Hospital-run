import axios from 'axios/index';
import { setselectedContactId } from './contacts.actions';

export const GET_CHAT = '[CHAT PANEL] GET CHAT';
export const RECEIVE_CHAT = '[CHAT PANEL] RECEIVE CHAT';
export const REMOVE_CHAT = '[CHAT PANEL] REMOVE CHAT';
export const SEND_MESSAGE = '[CHAT PANEL] SEND MESSAGE';

// export const socketConnection = openSocket(window.chatServer);
export function getChat(contactId) {
  return (dispatch, getState) => {
    const { id: userId } = getState().chatPanel.user;
    dispatch(setselectedContactId(contactId));
    const url = `${window.chatServer}/user/getChat`;
    const request = axios.post(url, {
      contactId,
      userId,
    });


    return request.then((response) => {
      console.log(`getChat response: ${response}`);
      if (!response.error && response.data.success) {
        return dispatch({
          type: GET_CHAT,
          chat: response.data.chat,
          userChatData: response.data.userChatData,
          contactId,
        });
      }
    })
      .catch((error) => {
        console.log(`getChat error:${error}`);
      });
  };
}

export function removeChat() {
  return {
    type: REMOVE_CHAT,
  };
}

export function sendMessage(message, contactId) {
  return dispatch => new Promise((resolve) => {
    dispatch({
      type: SEND_MESSAGE,
      message,
      contactId,
    });
    resolve();
  });
}

export function getMessage(response) {
  return dispatch => new Promise((resolve) => {
    dispatch({
      type: GET_CHAT,
      chat: response.chat,
      userChatData: response.userChatData,
    });
    resolve();
  });
}

export function receiveMessage(message, contactId, unread) {
  return dispatch => new Promise((resolve) => {
    dispatch({
      type: RECEIVE_CHAT,
      message,
      contactId,
      unread,
    });
    resolve();
  });
}

// export var sendMessage = () => (messageText, chatId, userId, contactId) =>
// {
//     const message = {
//         'who'    : userId,
//         'message': messageText,
//         'time'   : new Date()
//     };

//     socketConnection.emit('new_message',
// {chatId : chatId, message: message, contactId:contactId});
//     // const request = axios.post('/api/chat/send-message', {
//     //     chatId,
//     //     message
//     // });

//     return (dispatch) => {
//         return dispatch({
//             type        : SEND_MESSAGE,
//             message     : message,
//             userChatData: contactId
//         });


//     }
// }
