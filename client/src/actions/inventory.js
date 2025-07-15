import ActionTypes from '../constants/ActionTypes';

const fetchInventory = (subdomain) => ({
  type: ActionTypes.INVENTORY_FETCH,
  payload: {
    subdomain,
  },
});

fetchInventory.success = (inventory) => ({
  type: ActionTypes.INVENTORY_FETCH__SUCCESS,
  payload: {
    inventory,
  },
});

fetchInventory.failure = (error) => ({
  type: ActionTypes.INVENTORY_FETCH__FAILURE,
  payload: {
    error,
  },
});

const clearInventoryError = () => ({
  type: ActionTypes.INVENTORY_ERROR_CLEAR,
});

export default {
  fetchInventory,
  clearInventoryError,
};
