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
    case ActionTypes.MARKETING_FETCH_COMPLETED_REQUESTS:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case ActionTypes.MARKETING_FETCH_COMPLETED_REQUESTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: payload,
        error: null,
      };
    case ActionTypes.MARKETING_FETCH_COMPLETED_REQUESTS_ERROR:
      return {
        ...state,
        isFetching: false,
        error: payload.error,
      };
    default:
      return state;
  }
};
