import axios from 'axios/index';
import firebaseService from 'firebaseService';
import { setUserData } from 'auth/store/actions/user.actions';
import * as Actions from 'store/actions';
import _ from 'lodash';
import { setNavigation } from 'store/actions/fuse/navigation.actions';


export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_CLEAR = 'LOGIN_CLEAR';
export const LOGIN_IN_PROGRESS = 'LOGIN_IN_PROGRESS';

let requestInterceptor = null;


export function clearStatus() {
  return dispatch => dispatch({
    type: LOGIN_CLEAR,
  });
}


export function setLoginStatusToProgress() {
  return dispatch => dispatch({
    type: LOGIN_IN_PROGRESS,
  });
}


export function submitLogin({ email, password }) {
  const loginUrl = `${window.authServer}/user/login`;
  const request = axios.post(loginUrl, {
    username: email, password,
  });


  return dispatch => request.then(async (response) => {
    if (!response.data.error && response.data.success) {
      console.log(response.data.systemConfigs, 'abcdefgh')
      const obj = {};
      response.data.userPermission.forEach((data) => {
        if (obj[data.PERMISSION_URL]) {
          obj[data.PERMISSION_URL].push(data.PERMISSION_TYPE)
        } else {
          obj[data.PERMISSION_URL] = [data.PERMISSION_TYPE];
        }
      });

      const navigationConfig = [
        {
          id: 'applications',
          title: 'Applications',
          type: 'group',
          icon: 'apps',
          children: [

          ],

        },
      ];


      console.log('obj', obj)
      for (const path in obj) {
        if (obj.hasOwnProperty(path)) {
          const pathFragments = path.split('/').filter(el => el.length != 0);
          const parent = navigationConfig[0].children;
          traverseAndInsertToParent(parent, pathFragments, path);
        }
      }

      if (navigationConfig[0].children.length === 0) {
        return dispatch({
          type: LOGIN_ERROR,
          payload: 'You do not have any permissions',
        });
      }


      console.log('------------------------------------------------------------------------------------------------------------------------------###################################')
      console.log('navigationConfig', navigationConfig)

      function compare(a, b) {
        if (a.children === undefined && b.children === undefined) { return 0; }
        if (a.children === undefined) { return 1; }
        if (b.children === undefined) { return -1; }
        return 0;
      }

      navigationConfig[0].children.sort(compare);

      for (let i = 0; i < navigationConfig[0].children.length; i++) {
        if (navigationConfig[0].children[i].children !== undefined) {
          navigationConfig[0].children[i].children.sort(compare)
        }
      }

      console.log('navigationConfig sorted', navigationConfig)

      // _.sortBy(navigationConfig[0].children, [function(o) { return o.title; }]);

      /* navigationConfig.sort(function(a, b){
                    if(a.children && b.children){
                        return 0;
                    }else if(a.children){
                        return -1;
                    }else if(b.children){
                        return 1;
                    }else{
                        return 0;
                    }
                }); */

      function traverseAndInsertToParent(parentArray, pathFragments, fullPath) {
        console.log('traverseAndInsertToParent', parentArray, pathFragments, fullPath);

        for (let i = 0; i < parentArray.length; i++) {
          const element = parentArray[i];
          if (element.id === pathFragments[0]) {
            if (pathFragments.length > 1) {
              /* element.children.push({
                                    id : pathFragments[0],
                                    title : _.capitalize(pathFragments[0]),
                                    type : 'collapse',
                                    icon : 'group',
                                    children: [

                                    ]
                                }); */

              pathFragments.shift();
              // var newParentAray = element.children[element.children.length-1].children;
              var newParentAray = parentArray[i].children
              return traverseAndInsertToParent(newParentAray, pathFragments, fullPath)
            }

            element.children.push({
              id: pathFragments[0],
              title: _.startCase(pathFragments[0]),
              type: 'item',
              url: fullPath,

            });
            pathFragments.shift();
            return null;
          }
        }

        console.log('not found in parent array...');

        const icons = {
          Salary: 'account_balance_wallet',
          Training: 'accessibility_new',
          'Asset Management': 'assessment',
          Attendance: 'ballot',
          Report: 'description',
          'Employee Management': 'contacts',
          Group: 'group',
          'Leave Management': 'gavel',
          Loan: 'receipt',
          'Master Data': 'developer_board',
          'Meta Data': 'device_hub',
          'Leave User': 'contact_mail',
          Roster: 'compare_arrows',
          Shift: 'transfer_within_a_station',
          'Travel Management': 'departure_board',
          Announcement: 'mic_none',
          Dashboard: 'dvr',
          'Day Types': 'table_chart',
          Calendar: 'event',
          Setting: 'device_hub',
          'Item Master': 'accessibility_new',
          Attributes: 'developer_board',
          'Customer Registration': 'group',
          'Location Master': 'compare_arrows',
          Store: 'account_balance_wallet',
          'Supplier Registration': 'transfer_within_a_station',


        };


        if (pathFragments.length > 1) {
          console.log('inserted as a parent');
          const pushItem = {
            id: pathFragments[0],
            title: _.startCase(pathFragments[0]),
            type: 'collapse',
            // icon: 'group',
            children: [],
          };

          if (icons[_.startCase(pathFragments[0])]) {
            pushItem.icon = icons[_.startCase(pathFragments[0])];
          }

          parentArray.push(pushItem);

          pathFragments.shift();
          var newParentAray = parentArray[parentArray.length - 1].children;
          return traverseAndInsertToParent(newParentAray, pathFragments, fullPath)
        }
        console.log('inserted as a last child');
        parentArray.push({
          id: pathFragments[0],
          title: _.startCase(pathFragments[0]),
          type: 'item',
          url: fullPath,
        });
        pathFragments.shift();
        return null;
      }

      console.log('userPermission', obj);
      const userData = {
        userPermission: obj,
        role: 'user',
        data: {
          displayName: 'None',
          photoURL: '',
          settings: {
            layout: {
              style: 'layout1',
              config: {
                scroll: 'content',
                navbar: {
                  display: true,
                  folded: true,
                  position: 'left',
                },
                toolbar: {
                  display: true,
                  style: 'fixed',
                  position: 'below',
                },
                footer: {
                  display: true,
                  style: 'fixed',
                  position: 'below',
                },
                mode: 'fullwidth',
              },
            },
            customScrollbars: true,
            /* theme           : {
                                main   : 'defaultDark',
                                navbar : 'defaultDark',
                                toolbar: 'defaultDark',
                                footer : 'defaultDark'
                            } */
          },
          shortcuts: [
            'calendar',
            'mail',
            'contacts',
          ],
        },

      };

      if (response.data.token) {
        userData.token = response.data.token;
      }

      console.log('requestInterceptor from login', requestInterceptor);


      axios.interceptors.request.eject(0);

      requestInterceptor = axios.interceptors.request.use((config) => {
        config.headers = { Authorization: userData.token };

        return config;
      }, error => Promise.reject(error));


      if (response.data.userId) {
        userData.userId = response.data.userId;
        try {
          const roles = await getEmployeeRole(response.data.userId);
          userData.roleDetails = roles;
        } catch (error) {
          console.log('error', error);
        }
        // try {

        //   const userCompany = await getUserCompanyIdAndLocationId(response.data.userId);
        //   userData.userCompanyDetail = userCompany;
        // } catch (error) {
        //   console.log('error', error);
        // }
      }

      console.log('response.data.employee', response.data.employee);
      if (response.data.employee && response.data.employee[0].ID_EMPLOYEE_REGISTRY) {
        try {
          const employeeProfile = await getEmployeeProfile(response.data.employee[0].ID_EMPLOYEE_REGISTRY);
          console.log('employeeProfile', employeeProfile);
          userData.employee = employeeProfile;

          userData.data.displayName = employeeProfile.DISPLAY_NAME || 'None';
          userData.data.photoURL = employeeProfile.IMAGE_PATH || '';

          console.log('userData', userData);
        } catch (error) {
          console.log('Error getting logged employee profile', error);
        }
      }


      dispatch(setUserData(userData));
      dispatch(setNavigation(navigationConfig));

      sessionStorage.setItem('h2biz_18_userData', JSON.stringify(userData));
      sessionStorage.setItem('h2biz_18_navigationConfig', JSON.stringify(navigationConfig));


      return dispatch({
        type: LOGIN_SUCCESS,
      });
    }


    return dispatch({
      type: LOGIN_ERROR,
      payload: 'Invalid Username or Password',
    });
  })
    .catch((error) => {
      console.log('login error', error);
      return dispatch({
        type: LOGIN_ERROR,
        payload: 'Auth Server Error',
      })
    });
}


export function loginWithFireBase({ username, password }) {
  return dispatch => firebaseService.auth.signInWithEmailAndPassword(username, password)
    .then(() => dispatch({
      type: LOGIN_SUCCESS,
    }))
    .catch((error) => {
      const usernameErrorCodes = [
        'auth/email-already-in-use',
        'auth/invalid-email',
        'auth/operation-not-allowed',
        'auth/user-not-found',
        'auth/user-disabled',
      ];
      const passwordErrorCodes = [
        'auth/weak-password',
        'auth/wrong-password',
      ];

      const response = {
        username: usernameErrorCodes.includes(error.code) ? error.message : null,
        password: passwordErrorCodes.includes(error.code) ? error.message : null,
      };

      if (error.code === 'auth/invalid-api-key') {
        dispatch(Actions.showMessage({ message: error.message }));
      }

      return dispatch({
        type: LOGIN_ERROR,
        payload: response,
      });
    });
}


// var getUserCompanyIdAndLocationId = userId => new Promise(((resolve, reject) => {
//   const url1 = `${window.systemServer}/location/getUserCompanyIdAndLocationId`;
//   const request = axios.post(url1, { ID_USER: userId });
//   request.then((response) => {
//     if (response.data.success) {
//       resolve(response.data.result[0]);
//     } else {
//       reject(new Error('response error'));
//     }
//   })
//     .catch((error) => {
//       reject(error);
//     });
// }));
var getEmployeeProfile = regId => new Promise(((resolve, reject) => {
  const url1 = `${window.hrmServer}/commonAPI/getEmployeeProfileByRegistryId`;
  const request = axios.post(url1, { regId });
  request.then((response) => {
    if (!response.error && response.data.success) {
      resolve(response.data.employeeProfile[0]);
    } else {
      reject(new Error('response error'));
    }
  })
    .catch((error) => {
      reject(error);
    });
}));

var getEmployeeRole = userId => new Promise(((resolve, reject) => {
  const url1 = `${window.authServer}/roles/getRoleOfUser`;
  const request = axios.post(url1, { ID_USER: userId });
  request.then((response) => {
    if (!response.error && response.data.success) {
      if (response.data.role && response.data.role.length && response.data.role.length > 0) {
        resolve(response.data.role[0]);
      } else {
        reject(new Error('no roles received'));
      }
    } else {
      reject(new Error('response error'));
    }
  })
    .catch((error) => {
      reject(error);
    });
}));
