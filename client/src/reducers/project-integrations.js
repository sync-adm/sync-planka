import ActionTypes from '../constants/ActionTypes';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

// eslint-disable-next-line default-param-last
export default function projectIntegrationsReducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.PROJECT_INTEGRATIONS_FETCH:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case ActionTypes.PROJECT_INTEGRATIONS_FETCH__SUCCESS:
      return {
        ...state,
        items: action.payload.projectIntegrations,
        isLoading: false,
        error: null,
      };
    case ActionTypes.PROJECT_INTEGRATIONS_FETCH__FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    case ActionTypes.PROJECT_INTEGRATION_CREATE__SUCCESS:
      return {
        ...state,
        items: [...state.items, action.payload.projectIntegration],
      };
    case ActionTypes.PROJECT_INTEGRATION_UPDATE__SUCCESS:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.projectIntegration.id
            ? action.payload.projectIntegration
            : item,
        ),
      };
    case ActionTypes.PROJECT_INTEGRATION_DELETE__SUCCESS:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.projectIntegration.id),
      };
    default:
      return state;
  }
}
