import ActionTypes from '../constants/ActionTypes';

const fetchPostizIntegrations = (projectId) => ({
  type: ActionTypes.POSTIZ_INTEGRATIONS_FETCH,
  payload: {
    projectId,
  },
});

fetchPostizIntegrations.success = (postizIntegrations) => ({
  type: ActionTypes.POSTIZ_INTEGRATIONS_FETCH__SUCCESS,
  payload: {
    postizIntegrations,
  },
});

fetchPostizIntegrations.failure = (error) => ({
  type: ActionTypes.POSTIZ_INTEGRATIONS_FETCH__FAILURE,
  payload: {
    error,
  },
});

const clearPostizIntegrationsError = () => ({
  type: ActionTypes.POSTIZ_INTEGRATIONS_ERROR_CLEAR,
});

export default {
  fetchPostizIntegrations,
  clearPostizIntegrationsError,
};
