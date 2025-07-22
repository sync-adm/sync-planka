import ActionTypes from '../constants/ActionTypes';

export const fetchCompletedRequests = (data) => ({
  type: ActionTypes.MARKETING_FETCH_COMPLETED_REQUESTS,
  payload: {
    data,
  },
});

export const fetchCompletedRequestsSuccess = (data) => ({
  type: ActionTypes.MARKETING_FETCH_COMPLETED_REQUESTS_SUCCESS,
  payload: data,
});

export const fetchCompletedRequestsFailure = (error) => ({
  type: ActionTypes.MARKETING_FETCH_COMPLETED_REQUESTS_ERROR,
  payload: {
    error,
  },
});

export const fetchEvolutionGroups = (data) => ({
  type: ActionTypes.MARKETING_FETCH_EVOLUTION_GROUPS,
  payload: {
    data,
  },
});

export const fetchEvolutionGroupsSuccess = (data) => ({
  type: ActionTypes.MARKETING_FETCH_EVOLUTION_GROUPS_SUCCESS,
  payload: data,
});

export const fetchEvolutionGroupsFailure = (error) => ({
  type: ActionTypes.MARKETING_FETCH_EVOLUTION_GROUPS_ERROR,
  payload: {
    error,
  },
});

const sendWhatsAppMessage = (number, message) => ({
  type: ActionTypes.MARKETING_SEND_WHATSAPP_MESSAGE,
  payload: {
    number,
    message,
  },
});

const clearWhatsAppMessageError = () => ({
  type: ActionTypes.MARKETING_CLEAR_WHATSAPP_MESSAGE_ERROR,
});

export const sendWhatsAppMessageSuccess = (data) => ({
  type: ActionTypes.MARKETING_SEND_WHATSAPP_MESSAGE_SUCCESS,
  payload: data,
});

export const sendWhatsAppMessageFailure = (error) => ({
  type: ActionTypes.MARKETING_SEND_WHATSAPP_MESSAGE_ERROR,
  payload: {
    error,
  },
});

export default {
  fetchCompletedRequests,
  fetchCompletedRequestsSuccess,
  fetchCompletedRequestsFailure,
  fetchEvolutionGroups,
  fetchEvolutionGroupsSuccess,
  fetchEvolutionGroupsFailure,
  sendWhatsAppMessage,
  sendWhatsAppMessageSuccess,
  sendWhatsAppMessageFailure,
  clearWhatsAppMessageError,
};
