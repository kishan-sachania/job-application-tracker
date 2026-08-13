import type { ApplicationState, ApplicationAction } from "../types";
import { ACTION_TYPES } from "../constants/actionTypes";

export const initialApplicationState: ApplicationState = {
  applications: [],
  loading: false,
  error: null,
};

export const applicationsReducer = (
  state: ApplicationState,
  action: ApplicationAction
) => {
  switch (action.type) {
    case ACTION_TYPES.SET_ALL: {
      if (Array.isArray(action.payload)) {
        return {
          ...state,
          applications: action.payload,
          loading: false,
          error: null,
        };
      }
      return {
        ...state,
        applications: action.payload.applications || [],
        pagination: action.payload.pagination || state.pagination,
        stats: action.payload.stats || state.stats,
        loading: false,
        error: null,
      };
    }

    case ACTION_TYPES.ADD:
      return {
        ...state,
        applications: [action.payload, ...state.applications],
      };

    case ACTION_TYPES.UPDATE:
      return {
        ...state,
        applications: state.applications.map((app) =>
          app.id === action.payload.id ? action.payload : app
        ),
      };

    case ACTION_TYPES.DELETE:
      return {
        ...state,
        applications: state.applications.filter(
          (app) => app.id !== action.payload
        ),
      };

    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};
