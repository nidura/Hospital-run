import axios from 'axios/index';
import { getAllUsers } from '../../../CommonAPIs';

export const GET_CONTACTS = '[CHAT PANEL] GET CONTACTS';
export const SET_SELECTED_CONTACT_ID = '[CHAT PANEL] SET SELECTED CONTACT ID';
export const REMOVE_SELECTED_CONTACT_ID = '[CHAT PANEL] REMOVE SELECTED CONTACT ID';
export const UPDATE_USER_STATUS = '[CHAT PANEL] UPDATE USER STATUS';

export function getContacts(userId) {
  console.log('getContacts called');
  const fletch = async (cb) => {
    try {
      let users = await getAllUsers();
      users = users.filter(value => value.ID_USER !== userId);
      const employeeRegIds = users.map(user => user.ID_EMPLOYEE_REGISTRY);
      const userIds = users.map(user => user.ID_USER);
      const empIdMap = {};
      users.forEach((user) => {
        empIdMap[user.ID_USER] = { empId: user.ID_EMPLOYEE_REGISTRY, userName: user.USERNAME }
      });
      const promise1 = getImagePathOfUserAccounts(employeeRegIds);
      const promise2 = getStatusOfUserAccounts(userIds, userId);

      const result = await Promise.all([promise1, promise2]);
      const imageUrlList = result[0];
      const statusList = result[1];

      const userObj = [];
      const length = userIds.length;
      for (let i = 0; i < length; i++) {
        const empId = empIdMap[userIds[i]] && empIdMap[userIds[i]].empId != '' ? empIdMap[userIds[i]].empId : null;
        userObj.push({
          id: userIds[i],
          name: empId ? `${imageUrlList[empId].FIRSTNAME} ${imageUrlList[empId].LASTNAME}` : empIdMap[userIds[i]].userName,
          avatar: empId ? imageUrlList[empId].IMAGE_PATH : 'assets/images/avatars/Velazquez.jpg',
          status: statusList[userIds[i]].status,
          unread: statusList[userIds[i]].unread !== 0 ? statusList[userIds[i]].unread : null,
        });
      }
      console.log('contactsReducer 2 called');
      console.log(userObj);
      cb(userObj);
    } catch (error) {
      console.log('getContacts error', error);
    }
  };
  return dispatch => fletch((response) => {
    dispatch({
      type: GET_CONTACTS,
      payload: response,
    })
  });
}

export var getStatusOfUserAccounts = (userIds, userId) => new Promise(((resolve, reject) => {
  const url1 = `${window.chatServer}/user/getStatusIDList`;
  const request = axios.post(url1, { userIds, userId });
  request.then((response) => {
    if (!response.error && response.data.success) {
      resolve(response.data.statusList);
    } else {
      reject(new Error('response error'));
    }
  })
    .catch((error) => {
      reject(error);
    });
}));

export var getImagePathOfUserAccounts = employeeIds => new Promise(((resolve, reject) => {
  const url1 = `${window.hrmServer}/employeeView/getImagePathOfIDList`;
  const request = axios.post(url1, { employeeIds });
  request.then((response) => {
    if (!response.error && response.data.success) {
      resolve(response.data.employeeImages);
    } else {
      reject(new Error('response error'));
    }
  })
    .catch((error) => {
      reject(error);
    });
}));

export function setselectedContactId(contactId) {
  return {
    type: SET_SELECTED_CONTACT_ID,
    payload: contactId,
  }
}

export function removeSelectedContactId() {
  return {
    type: REMOVE_SELECTED_CONTACT_ID,
  }
}


export function updateUserStatus(userId, status) {
  return dispatch => new Promise((resolve) => {
    dispatch({
      type: UPDATE_USER_STATUS,
      contactId: userId,
      status,
    });
    resolve();
  });
}
