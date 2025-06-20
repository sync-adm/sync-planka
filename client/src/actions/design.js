import ActionTypes from '../constants/ActionTypes';

export const fetchNewRequests = (data) => ({
  type: ActionTypes.DESIGN_FETCH_NEW_REQUESTS,
  payload: {
    data,
  },
});

export const fetchNewRequestsSuccess = (data) => ({
  type: ActionTypes.DESIGN_FETCH_NEW_REQUESTS_SUCCESS,
  payload: data,
});

export const fetchNewRequestsFailure = (error) => ({
  type: ActionTypes.DESIGN_FETCH_NEW_REQUESTS_ERROR,
  payload: {
    error,
  },
});

export default {
  fetchNewRequests,
  fetchNewRequestsSuccess,
  fetchNewRequestsFailure,
};
