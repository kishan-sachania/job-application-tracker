import { useReducer, useCallback } from "react";
import {
  applicationsReducer,
  initialApplicationState,
} from "../reducer/applicationsReducer";
import { ACTION_TYPES } from "../constants/actionTypes";
import {
  getApplicationsApi,
  createApplicationApi,
  updateApplicationApi,
  deleteApplicationApi,
  getApplicationStatsApi,
  getStatsApi,
} from "../api/applications";
import type { FetchApplicationsParams } from "../api/applications";
import type { JobApplicationInput } from "../types";
import { Status } from "../types";
import { getErrorMessage } from "../utils/error";

export const useApplications = () => {
  const [state, dispatch] = useReducer(
    applicationsReducer,
    initialApplicationState
  );

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await getApplicationStatsApi();
      if (statsData) {
        dispatch({ type: ACTION_TYPES.SET_STATS, payload: statsData });
      }
    } catch {
      // Ignore stats fetch errors
    }
  }, []);

  const fetchApplications = useCallback(
    async (params?: FetchApplicationsParams) => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      try {
        const [data, statsData] = await Promise.all([
          getApplicationsApi(params),
          getApplicationStatsApi().catch(() => null),
        ]);
        dispatch({ type: ACTION_TYPES.SET_ALL, payload: data });
        if (statsData) {
          dispatch({ type: ACTION_TYPES.SET_STATS, payload: statsData });
        }
      } catch (err: unknown) {
        const errMsg = getErrorMessage(err, "Failed to fetch job applications.");
        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          payload: errMsg,
        });
      }
    },
    []
  );

  const addApplication = useCallback(async (input: JobApplicationInput) => {
    try {
      const created = await createApplicationApi(input);
      dispatch({ type: ACTION_TYPES.ADD, payload: created });
      fetchStats();
      return created;
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err, "Failed to create application.");
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errMsg });
      throw new Error(errMsg);
    }
  }, [fetchStats]);

  const updateApplication = useCallback(
    async (id: string, input: Partial<JobApplicationInput>) => {
      try {
        const updated = await updateApplicationApi(id, input);
        dispatch({ type: ACTION_TYPES.UPDATE, payload: updated });
        fetchStats();
        return updated;
      } catch (err: unknown) {
        const errMsg = getErrorMessage(err, "Failed to update application.");
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errMsg });
        throw new Error(errMsg);
      }
    },
    [fetchStats]
  );

  const updateStatus = useCallback(
    async (id: string, status: Status) => {
      return updateApplication(id, { status });
    },
    [updateApplication]
  );

  const deleteApplication = useCallback(async (id: string) => {
    try {
      await deleteApplicationApi(id);
      dispatch({ type: ACTION_TYPES.DELETE, payload: id });
      fetchStats();
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err, "Failed to delete application.");
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errMsg });
      throw new Error(errMsg);
    }
  }, [fetchStats]);

  const stats = state.stats || getStatsApi(state.applications);

  return {
    applications: state.applications,
    pagination: state.pagination,
    loading: state.loading,
    error: state.error,
    stats,
    fetchApplications,
    addApplication,
    updateApplication,
    updateStatus,
    deleteApplication,
  };
};

export default useApplications;
