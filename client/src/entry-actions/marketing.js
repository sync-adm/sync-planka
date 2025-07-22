import EntryActionTypes from '../constants/EntryActionTypes';

export const fetchMarketingCompletedRequests = (data) => ({
  type: EntryActionTypes.MARKETING_FETCH_COMPLETED_REQUESTS,
  payload: { data },
});

export const fetchEvolutionGroups = (data = {}) => ({
  type: EntryActionTypes.MARKETING_FETCH_EVOLUTION_GROUPS,
  payload: { data },
});

export default {
  fetchMarketingCompletedRequests,
  fetchEvolutionGroups,
};
