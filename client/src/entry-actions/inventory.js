import EntryActionTypes from '../constants/EntryActionTypes';

const fetchInventory = (subdomain) => ({
  type: EntryActionTypes.INVENTORY_FETCH,
  payload: {
    subdomain,
  },
});

const clearInventoryError = () => ({
  type: EntryActionTypes.INVENTORY_ERROR_CLEAR,
  payload: {},
});

export default {
  fetchInventory,
  clearInventoryError,
};
