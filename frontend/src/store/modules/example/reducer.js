import * as types from '../types';

const initialState = {
  btnClicked: false,
};

// eslint-disable-next-line func-names
export default function (state = initialState, action) {
  switch (action.type) {
    case types.CLICKED_BTN_SUCCESS: {
      // console.log('success...');
      const newState = { ...state };
      newState.btnClicked = !newState.btnClicked;
      return newState;
    }

    case types.CLICKED_BTN_FAILURE: {
      // console.log('error...');
      return state;
    }

    case types.CLICKED_BTN_REQUEST: {
      // console.log('request...');
      return state;
    }

    default: {
      return state;
    }
  }
}
