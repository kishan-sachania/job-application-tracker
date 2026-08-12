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
): ApplicationState => {
  switch (action.type) {
    case ACTION_TYPES.SET_ALL:
      return {
        ...state,
        applications: action.payload,
        loading: false,
        error: null,
      };

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
