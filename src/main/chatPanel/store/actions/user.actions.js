import axios from 'axios/index';

export const GET_USER_DATA = '[CHAT PANEL] GET USER DATA';

export function getUserData(userId, name, image) {
  const url = `${window.chatServer}/user/chatList`;
  const request = axios.post(url, {
    userId,
  });
  console.log(`getUserData Called.${JSON.stringify(request)}`);
  return dispatch => request.then((response) => {
    if (!response.error && response.data.success) {
      const user = response.data.user;
      user.avatar = image;
      user.name = name;
      console.log(`chatUser:${user}`)
      dispatch({
        type: GET_USER_DATA,
        payload: user,
      })
    } else {
      console.log('user data responce error in chat');
      // ToDo request again.
    }
  });
}
