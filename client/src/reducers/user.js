import * as actionType from '../actions/user';

const INITIAL_STATE = {
  users: [], email: '', password: null, token: null, loading: false, error: null
};

export default function (state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    case actionType.REMOVE_USER_TOKEN:
      return {
        ...state,
        email: '',
        token: null,
        error: null,
        loading: false
      };
    case actionType.GET_USER_TOKEN:
      return {
        ...state,
        password: action.password,
        token: '',
        error: null,
        loading: true
      };
    case actionType.RESTORE_USER_TOKEN:
      return {
        ...state,
        token: action.token
      };
    case actionType.GET_TOKEN_RESULT:
      error = action.message || '';
      return {
        ...state,
        password: null,
        email: null,
        token: action.token,
        error,
        loading: false
      };
    case actionType.USER_OPERATION_SUCCESS:
      return {
        ...state,
        users: action.users || state.users,
        email: action.email || state.email,
        token: action.token || state.token,
        password: null,
        error: null,
        loading: false
      };
    case actionType.USER_OPERATION_FAILURE:
      error = action.message;
      return {...state, error, loading: false};
    case actionType.TOKEN_VALIDATION_FAILURE:
      return {
        ...state,
        token: null,
        email: null,
        password: null,
        error: null,
        loading: false
      };
    case actionType.FETCH_USERS:
      return {...state, users: [], error: null, loading: true};
    case actionType.REGISTER_USER:
      return {...state, error: null, loading: true};
    case actionType.EDIT_USER:
      return {...state, error: null, loading: true};
    case actionType.DELETE_USER:
      return {...state, error: null, loading: true};
    default:
      return state;
  }
}
