import * as Actions from '../actions';

const initialState = {
  role: 'guest',
  roleDetails: {},
  // extraPrivileges : ['/example'],
  // extraPrivileges : [],
  // reducedPriviledges : [],
  userPermission: {},
  data: {
    displayName: 'John Doe',
    photoURL: 'assets/images/avatars/Velazquez.jpg',
    email: 'johndoe@withinpixels.com',
    shortcuts: [
      'calendar',
      'mail',
      'contacts',
      'todo',
    ],
  },
  employee: {},
  userId: null,
  token : null,
  isFetching: true,
  locationId: 45,
};

const user = function (state = initialState, action) {
  switch (action.type) {
    case Actions.SET_USER_DATA:
    {
      return {
        ...initialState,
        ...action.payload,
        isFetching: action.isFetching,
      };
    }
    case Actions.REMOVE_USER_DATA:
    {
      return {
        ...initialState,
      };
    }
    case Actions.USER_LOGGED_OUT:
    {
      return initialState;
    }

    default:
    {
      return state;
    }
  }
};

export default user;
