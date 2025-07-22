import ActionTypes from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  error: null,
  data: {
    cards: [],
    pagination: {
      page: 1,
      limit: 20,
      totalRecords: 0,
      totalPages: 0,
      hasMore: false,
    },
  },
  evolutionGroups: {
    isFetching: false,
    error: null,
    data: [],
  },
  whatsappMessage: {
    isSending: false,
    error: null,
    lastSent: null,
  },
};

// eslint-disable-next-line default-param-last
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.MARKETING_FETCH_COMPLETED_REQUESTS:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case ActionTypes.MARKETING_FETCH_COMPLETED_REQUESTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: payload,
        error: null,
      };
    case ActionTypes.MARKETING_FETCH_COMPLETED_REQUESTS_ERROR:
      return {
        ...state,
        isFetching: false,
        error: payload.error,
      };
    case ActionTypes.MARKETING_FETCH_EVOLUTION_GROUPS:
      return {
        ...state,
        evolutionGroups: {
          ...state.evolutionGroups,
          isFetching: true,
          error: null,
        },
      };
    case ActionTypes.MARKETING_FETCH_EVOLUTION_GROUPS_SUCCESS:
      return {
        ...state,
        evolutionGroups: {
          ...state.evolutionGroups,
          isFetching: false,
          data: payload.groups || [],
          error: null,
        },
      };
    case ActionTypes.MARKETING_FETCH_EVOLUTION_GROUPS_ERROR:
      return {
        ...state,
        evolutionGroups: {
          ...state.evolutionGroups,
          isFetching: false,
          error: payload.error,
        },
      };
    case ActionTypes.MARKETING_SEND_WHATSAPP_MESSAGE:
      return {
        ...state,
        whatsappMessage: {
          ...state.whatsappMessage,
          isSending: true,
          error: null,
        },
      };
    case ActionTypes.MARKETING_SEND_WHATSAPP_MESSAGE_SUCCESS:
      return {
        ...state,
        whatsappMessage: {
          ...state.whatsappMessage,
          isSending: false,
          lastSent: payload,
          error: null,
        },
      };
    case ActionTypes.MARKETING_SEND_WHATSAPP_MESSAGE_ERROR:
      return {
        ...state,
        whatsappMessage: {
          ...state.whatsappMessage,
          isSending: false,
          error: payload.error,
        },
      };
    case ActionTypes.MARKETING_CLEAR_WHATSAPP_MESSAGE_ERROR:
      return {
        ...state,
        whatsappMessage: {
          ...state.whatsappMessage,
          error: null,
        },
      };
    default:
      return state;
  }
};
