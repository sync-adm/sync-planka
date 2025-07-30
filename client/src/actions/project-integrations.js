import ActionTypes from '../constants/ActionTypes';

const createProjectIntegration = (projectId, data) => ({
  type: ActionTypes.PROJECT_INTEGRATION_CREATE,
  payload: {
    projectId,
    data,
  },
});

createProjectIntegration.success = (projectIntegration) => ({
  type: ActionTypes.PROJECT_INTEGRATION_CREATE__SUCCESS,
  payload: {
    projectIntegration,
  },
});

createProjectIntegration.failure = (error) => ({
  type: ActionTypes.PROJECT_INTEGRATION_CREATE__FAILURE,
  payload: {
    error,
  },
});

const fetchProjectIntegrations = (projectId) => ({
  type: ActionTypes.PROJECT_INTEGRATIONS_FETCH,
  payload: {
    projectId,
  },
});

fetchProjectIntegrations.success = (projectIntegrations) => ({
  type: ActionTypes.PROJECT_INTEGRATIONS_FETCH__SUCCESS,
  payload: {
    projectIntegrations,
  },
});

fetchProjectIntegrations.failure = (error) => ({
  type: ActionTypes.PROJECT_INTEGRATIONS_FETCH__FAILURE,
  payload: {
    error,
  },
});

const updateProjectIntegration = (id, data) => ({
  type: ActionTypes.PROJECT_INTEGRATION_UPDATE,
  payload: {
    id,
    data,
  },
});

updateProjectIntegration.success = (projectIntegration) => ({
  type: ActionTypes.PROJECT_INTEGRATION_UPDATE__SUCCESS,
  payload: {
    projectIntegration,
  },
});

updateProjectIntegration.failure = (error) => ({
  type: ActionTypes.PROJECT_INTEGRATION_UPDATE__FAILURE,
  payload: {
    error,
  },
});

const deleteProjectIntegration = (id) => ({
  type: ActionTypes.PROJECT_INTEGRATION_DELETE,
  payload: {
    id,
  },
});

deleteProjectIntegration.success = (projectIntegration) => ({
  type: ActionTypes.PROJECT_INTEGRATION_DELETE__SUCCESS,
  payload: {
    projectIntegration,
  },
});

deleteProjectIntegration.failure = (error) => ({
  type: ActionTypes.PROJECT_INTEGRATION_DELETE__FAILURE,
  payload: {
    error,
  },
});

const clearProjectIntegrationCreateError = () => ({
  type: ActionTypes.PROJECT_INTEGRATION_CREATE_ERROR_CLEAR,
});

export default {
  createProjectIntegration,
  fetchProjectIntegrations,
  updateProjectIntegration,
  deleteProjectIntegration,
  clearProjectIntegrationCreateError,
};
