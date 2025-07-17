export const selectInventoryData = (state) => state.inventory.data;
export const selectInventoryIsFetching = (state) => state.inventory.isFetching;
export const selectInventoryError = (state) => state.inventory.error;

export default {
  selectInventoryData,
  selectInventoryIsFetching,
  selectInventoryError,
};
