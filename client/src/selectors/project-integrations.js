export const selectProjectIntegrationsState = (state) => state.projectIntegrations;

export const selectProjectIntegrations = (state) => selectProjectIntegrationsState(state).items;

export const selectIsProjectIntegrationsLoading = (state) =>
  selectProjectIntegrationsState(state).isLoading;

export const selectProjectIntegrationsError = (state) =>
  selectProjectIntegrationsState(state).error;

export const selectProjectIntegrationCreateError = (state) =>
  selectProjectIntegrationsState(state).createError;

export default {
  selectProjectIntegrations,
  selectIsProjectIntegrationsLoading,
  selectProjectIntegrationsError,
  selectProjectIntegrationCreateError,
  selectProjectIntegrationsState,
};
