'use strict';

import * as actions from '../../client/src/actions/colors';
import * as actionTypes from '../../client/src/actionTypes/colors';
import reducer from '../../client/src/reducers/colors';

const INITIAL_STATE = {
  colors: [], colorsNumber: 0, error: null, loading: false
};

describe('colors reducer', () => {
  test('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(INITIAL_STATE)
  });

  test('should handle ' + actionTypes.FETCH_COLORS, () => {
    expect(
      reducer(INITIAL_STATE, {
        type: actionTypes.FETCH_COLORS
      })).toEqual({...INITIAL_STATE, loading: true});
  });

  test('should handle ' + actionTypes.FETCH_COLORS_NUMBER, () => {
    expect(
      reducer(INITIAL_STATE, {
        type: actionTypes.FETCH_COLORS_NUMBER
      })).toEqual({...INITIAL_STATE, loading: true});
  });

  test('should handle ' + actionTypes.CREATE_COLOR, () => {
    expect(
      reducer(INITIAL_STATE, {
        type: actionTypes.CREATE_COLOR
      })).toEqual({...INITIAL_STATE, loading: true});
  });

  test('should handle ' + actionTypes.EDIT_COLOR, () => {
    expect(
      reducer(INITIAL_STATE, {
        type: actionTypes.EDIT_COLOR
      })).toEqual({...INITIAL_STATE, loading: true});
  });

  test('should handle ' + actionTypes.DELETE_COLOR, () => {
    expect(
      reducer(INITIAL_STATE, {
        type: actionTypes.DELETE_COLOR
      })).toEqual({...INITIAL_STATE, loading: true});
  });

  test('should handle ' + actionTypes.COLOR_OPERATION_SUCCESS, () => {
    expect(
      reducer(INITIAL_STATE, {
        type: actionTypes.COLOR_OPERATION_SUCCESS,
        colors: [{a: 1, b: 2}],
        colorsNumber: 5,
        error: null,
        loading: false
      })).toEqual({
      ...INITIAL_STATE,
      colors: [{a: 1, b: 2}],
      colorsNumber: 5,
      error: null,
      loading: false
    });
  });

  test('should handle ' + actionTypes.COLOR_OPERATION_FAILURE, () => {
    const error = 'some error';
    expect(
      reducer(INITIAL_STATE, {
        type: actionTypes.COLOR_OPERATION_FAILURE,
        message: error
      })).toEqual({
      ...INITIAL_STATE, error
    });
  });
});
