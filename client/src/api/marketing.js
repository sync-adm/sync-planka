import http from './http';

const getCompletedRequests = async ({ page, limit, includeAllFields, listNameContains }, headers) =>
  http.get(
    `/marketing/completed-requests?limit=${limit || 20}&page=${page || 1}&includeAllFields=${!!includeAllFields}&listNameContains=${encodeURIComponent(
      listNameContains || 'Conclu',
    )}`,
    null,
    headers,
  );

export default {
  getCompletedRequests,
};
