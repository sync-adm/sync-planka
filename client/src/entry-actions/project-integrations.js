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

export default {
  createProjectIntegration,
  fetchProjectIntegrations,
  updateProjectIntegration,
  deleteProjectIntegration,
};
