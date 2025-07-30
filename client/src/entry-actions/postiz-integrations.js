import EntryActionTypes from '../constants/EntryActionTypes';

const fetchPostizIntegrations = (projectId) => ({
  type: EntryActionTypes.POSTIZ_INTEGRATIONS_FETCH,
  payload: {
    projectId,
  },
});

const clearPostizIntegrationsError = () => ({
  type: EntryActionTypes.POSTIZ_INTEGRATIONS_ERROR_CLEAR,
  payload: {},
});

export default {
  fetchPostizIntegrations,
  clearPostizIntegrationsError,
};
