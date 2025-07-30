import EntryActionTypes from '../constants/EntryActionTypes';

const createProjectIntegration = (projectId, data) => ({
  type: EntryActionTypes.PROJECT_INTEGRATION_CREATE,
  payload: {
    projectId,
    data,
  },
});

const fetchProjectIntegrations = (projectId) => ({
  type: EntryActionTypes.PROJECT_INTEGRATIONS_FETCH,
  payload: {
    projectId,
  },
});

const updateProjectIntegration = (id, data) => ({
  type: EntryActionTypes.PROJECT_INTEGRATION_UPDATE,
  payload: {
    id,
    data,
  },
});

const deleteProjectIntegration = (id) => ({
  type: EntryActionTypes.PROJECT_INTEGRATION_DELETE,
  payload: {
    id,
  },
});

const handleProjectIntegrationCreate = (projectIntegration) => ({
  type: EntryActionTypes.PROJECT_INTEGRATION_CREATE_HANDLE,
  payload: {
    projectIntegration,
  },
});

const handleProjectIntegrationUpdate = (projectIntegration) => ({
  type: EntryActionTypes.PROJECT_INTEGRATION_UPDATE_HANDLE,
  payload: {
    projectIntegration,
  },
});

const handleProjectIntegrationDelete = (projectIntegration) => ({
  type: EntryActionTypes.PROJECT_INTEGRATION_DELETE_HANDLE,
  payload: {
    projectIntegration,
  },
});

const clearProjectIntegrationCreateError = () => ({
  type: EntryActionTypes.PROJECT_INTEGRATION_CREATE_ERROR_CLEAR,
});

export default {
  createProjectIntegration,
  fetchProjectIntegrations,
  updateProjectIntegration,
  deleteProjectIntegration,
  handleProjectIntegrationCreate,
  handleProjectIntegrationUpdate,
  handleProjectIntegrationDelete,
  clearProjectIntegrationCreateError,
};
