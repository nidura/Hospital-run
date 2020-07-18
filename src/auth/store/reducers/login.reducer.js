import * as Actions from '../actions';

const initialState = {
  success: false,
  error: {
    username: null,
    password: null,
  },
  message: null,
  loginClicked : false,
};

const login = function (state = initialState, action) {
  switch (action.type) {
    case Actions.LOGIN_SUCCESS:
    {
      return {
        ...initialState,
        success: true,
        message: 'Login Success',
        loginClicked  :false,
      };
    }
    case Actions.LOGIN_ERROR:
    {
      return {
        success: false,
        error: action.payload,
        message: action.payload,
        loginClicked  :false,
      };
    }
    case Actions.LOGIN_IN_PROGRESS:
    {
      return {
        ...initialState,
        loginClicked  :true,
      };
    }
    case Actions.LOGIN_CLEAR:
    {
      return initialState;
    }
    default:
    {
      return state;
    }
  }
};

export default login;
