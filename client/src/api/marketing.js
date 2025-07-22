import http from './http';

const getCompletedRequests = async ({ page, limit, includeAllFields, listNameContains }, headers) =>
  http.get(
    `/marketing/completed-requests?limit=${limit || 20}&page=${page || 1}&includeAllFields=${!!includeAllFields}&listNameContains=${encodeURIComponent(
      listNameContains || 'Conclu',
    )}`,
    null,
    headers,
  );

const getEvolutionGroups = async ({ getParticipants = false }, headers) =>
  http.get(`/marketing/evolution-groups?getParticipants=${getParticipants}`, null, headers);

const sendWhatsAppMessage = async ({ number, text }, headers) =>
  http.post('/marketing/send-message', { number, text }, headers);

export default {
  getCompletedRequests,
  getEvolutionGroups,
  sendWhatsAppMessage,
};
