import * as actionType from '../actionTypes/fonts';

const INITIAL_STATE = {
  fonts: [], fontsNumber: 0, fontsError: null, fontsLoading: false
};

export default function (state = INITIAL_STATE, action) {
  let fontsError;
  switch (action.type) {
    case actionType.FONTS_OPERATION_SUCCESS:
      return {
        ...state,
        fonts: action.fonts || state.fonts,
        fontsNumber: action.fontsNumber || state.fontsNumber,
        fontsError: null,
        fontsLoading: false
      };
    case actionType.FONTS_OPERATION_FAILURE:
      fontsError = action.message;
      return {...state, fontsError, fontsLoading: false};
    case actionType.FETCH_FONTS:
      return {...state, fonts: [], fontsError: null, fontsLoading: true};
    case actionType.FETCH_FONTS_NUMBER:
      return {...state, fontsNumber: 0, fontsError: null, fontsLoading: true};
    case actionType.CREATE_FONT:
      return {...state, fontsError: null, fontsLoading: true};
    case actionType.EDIT_FONT:
      return {...state, fontsError: null, fontsLoading: true};
    case actionType.DELETE_FONT:
      return {...state, fontsError: null, fontsLoading: true};
    default:
      return state;
  }
}
