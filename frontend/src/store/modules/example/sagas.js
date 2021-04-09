import { call, put, all, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import * as types from '../types';

const request = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 600);
  });

function* exampleRequest() {
  try {
    yield call(request);
    yield put(actions.clickBtnSuccess());
  } catch {
    yield put(actions.clickBtnFailure());
  }
}

export default all([takeLatest(types.CLICKED_BTN_REQUEST, exampleRequest)]);
