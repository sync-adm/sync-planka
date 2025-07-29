export const selectPostizIntegrationsData = (state) => state.postizIntegrations.data;
export const selectPostizIntegrationsIsFetching = (state) => state.postizIntegrations.isFetching;
export const selectPostizIntegrationsError = (state) => state.postizIntegrations.error;

export default {
  selectPostizIntegrationsData,
  selectPostizIntegrationsIsFetching,
  selectPostizIntegrationsError,
};
