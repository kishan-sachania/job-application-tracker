import api from "./axios";
import type {
  JobApplication,
  JobApplicationInput,
  ApiResponse,
  StatsResponse,
} from "../types";
import { Status } from "../types";

export interface FetchApplicationsParams {
  status?: string;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export const getApplicationsApi = async (
  params?: FetchApplicationsParams
): Promise<JobApplication[]> => {
  const response = await api.get<ApiResponse<JobApplication[]>>(
    "/applications/get-applications",
    { params }
  );
  return response.data.data || [];
};

export const createApplicationApi = async (
  data: JobApplicationInput
): Promise<JobApplication> => {
  const response = await api.post<ApiResponse<JobApplication>>(
    "/applications/apply",
    data
  );
  return response.data.data!;
};

export const updateApplicationApi = async (
  id: string,
  data: Partial<JobApplicationInput>
): Promise<JobApplication> => {
  const response = await api.patch<ApiResponse<JobApplication>>(
    `/applications/update/${id}`,
    data
  );
  return response.data.data!;
};

export const deleteApplicationApi = async (id: string) => {
  await api.delete<ApiResponse<null>>(`/applications/delete/${id}`);
};

export const getStatsApi = (applications: JobApplication[]): StatsResponse => {
  const counts: Record<Status, number> = {
    [Status.Applied]: 0,
    [Status.Screening]: 0,
    [Status.Interview]: 0,
    [Status.Offer]: 0,
    [Status.Closed]: 0,
  };

  let overdueFollowUps = 0;
  const todayStr = new Date().toISOString().split("T")[0];

  applications.forEach((app) => {
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

  const total = applications.length;
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
