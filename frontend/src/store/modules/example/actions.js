import * as types from '../types';

export function clickBtnRequest() {
  return {
    type: types.CLICKED_BTN_REQUEST,
  };
}

export function clickBtnSuccess() {
  return {
    type: types.CLICKED_BTN_SUCCESS,
  };
}

export function clickBtnFailure() {
  return {
    type: types.CLICKED_BTN_FAILURE,
  };
}
