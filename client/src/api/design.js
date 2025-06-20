import http from './http';

const getNewRequests = ({ page, limit, includeAllFields, listNameContains }, headers) =>
  http.get(
    `/design/new-requests?limit=${limit || 20}&page=${page || 1}&includeAllFields=${!!includeAllFields}&listNameContains=${encodeURIComponent(
      listNameContains || 'Solici',
    )}`,
    null,
    headers,
  );

export default {
  getNewRequests,
};
