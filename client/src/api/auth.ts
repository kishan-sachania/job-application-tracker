import api from "./axios";
import type { AuthResponse, User, ApiResponse } from "../types";

export const loginApi = async (credentials: {
  email: string;
  password?: string;
}) => {
  const response = await api.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    credentials
  );

  if (response.data?.data) {
    const { accessToken, refreshToken, token, user } = response.data.data;
    const activeToken = accessToken || token || "";
    if (refreshToken) {
      localStorage.setItem("job_tracker_refresh_token", refreshToken);
    }
    return { token: activeToken, user };
  }

  throw new Error(response.data?.message || "Login failed");
};

export const registerApi = async (data: {
  email: string;
  password?: string;
  name?: string;
}) => {
  const name = (data.name || data.email.split("@")[0]).trim();

  const response = await api.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    {
      name,
      email: data.email,
      password: data.password,
    }
  );

  if (response.data?.data) {
    const { accessToken, refreshToken, token, user } = response.data.data;
    const activeToken = accessToken || token || "";
    if (refreshToken) {
      localStorage.setItem("job_tracker_refresh_token", refreshToken);
    }
    return { token: activeToken, user };
  }

  throw new Error(response.data?.message || "Registration failed");
};

export const refreshTokenApi = async () => {
  const storedRefreshToken = localStorage.getItem("job_tracker_refresh_token");
  const response = await api.post<ApiResponse<{ accessToken: string }>>(
    "/auth/refresh-token",
    { refreshToken: storedRefreshToken }
  );

  const newAccessToken = response.data?.data?.accessToken;
  if (newAccessToken) {
    localStorage.setItem("job_tracker_token", newAccessToken);
    document.cookie = `job_tracker_token=${encodeURIComponent(newAccessToken)}; path=/; SameSite=Lax`;
    return newAccessToken;
  }
  throw new Error("Failed to refresh token");
};

export const getMeApi = async () => {
  const response = await api.get<ApiResponse<{ user: User }>>("/auth/me");
  if (response.data?.data?.user) {
    return response.data.data.user;
  }

  const userStr = localStorage.getItem("job_tracker_user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  throw new Error("No authenticated user found");
};

export const logoutApi = async () => {
  try {
    await api.post("/auth/logout");
  } catch {
    // Best-effort logout cleanup on backend
  } finally {
    localStorage.removeItem("job_tracker_token");
    localStorage.removeItem("job_tracker_refresh_token");
    localStorage.removeItem("job_tracker_user");
    document.cookie = "job_tracker_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
  }
};
