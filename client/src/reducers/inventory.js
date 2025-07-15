import ActionTypes from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  error: null,
  data: [],
};

// eslint-disable-next-line default-param-last
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.INVENTORY_FETCH:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case ActionTypes.INVENTORY_FETCH__SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: payload.inventory,
        error: null,
      };
    case ActionTypes.INVENTORY_FETCH__FAILURE:
      return {
        ...state,
        isFetching: false,
        error: payload.error,
      };
    case ActionTypes.INVENTORY_ERROR_CLEAR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
