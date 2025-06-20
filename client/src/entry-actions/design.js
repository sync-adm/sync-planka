import EntryActionTypes from '../constants/EntryActionTypes';

export const fetchDesignNewRequests = (data) => ({
  type: EntryActionTypes.DESIGN_FETCH_NEW_REQUESTS,
  payload: { data },
});

export default {
  fetchDesignNewRequests,
};
