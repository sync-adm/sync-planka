import EntryActionTypes from '../constants/EntryActionTypes';

export const fetchMarketingCompletedRequests = (data) => ({
  type: EntryActionTypes.MARKETING_FETCH_COMPLETED_REQUESTS,
  payload: { data },
});

export default {
  fetchMarketingCompletedRequests,
};
