import ActionTypes from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  error: null,
  data: {
    cards: [],
    pagination: {
      page: 1,
      limit: 20,
      totalRecords: 0,
      totalPages: 0,
      hasMore: false,
    },
  },
};

// eslint-disable-next-line default-param-last
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.DESIGN_FETCH_NEW_REQUESTS:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case ActionTypes.DESIGN_FETCH_NEW_REQUESTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: payload,
        error: null,
      };
    case ActionTypes.DESIGN_FETCH_NEW_REQUESTS_ERROR:
      return {
        ...state,
        isFetching: false,
        error: payload.error,
      };
    default:
      return state;
  }
};
