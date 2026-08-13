import api from "./axios";
import type {
  JobApplication,
  JobApplicationInput,
  ApiResponse,
} from "../types";
import { Status } from "../types";

export interface FetchApplicationsParams {
  status?: string;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  page: number;
  
}

export const getApplicationsApi = async (
  params?: FetchApplicationsParams
) => {
  const response = await api.get<ApiResponse<any>>(
    "/applications",
    { params }
  );
  return response.data.data || [];
};

export const createApplicationApi = async (
  data: JobApplicationInput
) => {
  const response = await api.post<ApiResponse<JobApplication>>(
    "/applications",
    data
  );
  return response.data.data!;
};

export const updateApplicationApi = async (
  id: string,
  data: Partial<JobApplicationInput>
) => {
  const response = await api.put<ApiResponse<JobApplication>>(
    `/applications/${id}`,
    data
  );
  return response.data.data!;
};

export const deleteApplicationApi = async (id: string) => {
  await api.delete<ApiResponse<null>>(`/applications/${id}`);
};

export const getApplicationStatsApi = async () => {
  const response = await api.get<ApiResponse<any>>("/applications/stats");
  return response.data.data;
};

export const getStatsApi = (applications: JobApplication[] = []) => {
  const counts: Record<Status, number> = {
    [Status.Applied]: 0,
    [Status.Screening]: 0,
    [Status.Interview]: 0,
    [Status.Offer]: 0,
    [Status.Closed]: 0,
  };

  let overdueFollowUps = 0;
  const todayStr = new Date().toISOString().split("T")[0];
  const appsList = Array.isArray(applications)
    ? applications
    : ((applications as any)?.applications || []);

  appsList.forEach((app) => {
    if (counts[app.status] !== undefined) {
      counts[app.status]++;
    }
    if (app.nextFollowUpDate) {
      const followUpStr = new Date(app.nextFollowUpDate)
        .toISOString()
        .split("T")[0];
      if (followUpStr <= todayStr && app.status !== Status.Closed) {
        overdueFollowUps++;
      }
    }
  });

  const total = appsList.length;
  const responses =
    counts[Status.Screening] + counts[Status.Interview] + counts[Status.Offer];
  const responseRate = total > 0 ? Math.round((responses / total) * 100) : 0;

  return {
    counts,
    total,
    responseRate,
    overdueFollowUps,
  };
};
