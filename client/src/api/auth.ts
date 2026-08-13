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

  if (response.data && response.data.data) {
    const data = response.data.data;
    const token = data.token || data.accessToken || "";
    const userId = data.user.id || "";
    const user: User = {
      id: userId,
      email: data.user.email,
      name: data.user.name || data.user.userName || data.user.email.split("@")[0],
    };
    return { token, user };
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

  if (response.data && response.data.data) {
    const resData = response.data.data;
    const token = resData.token || resData.accessToken || "";
    const userId = resData.user.id || resData.user.id || "";
    const user: User = {
      id: userId,
      email: resData.user.email,
      name: resData.user.name || resData.user.userName || resData.user.email.split("@")[0],
    };
    return { token, user };
  }

  throw new Error(response.data?.message || "Registration failed");
};

export const getMeApi = async () => {
  const response = await api.get<ApiResponse<{ user: User }>>("/auth/me");
  if (response.data && response.data.data?.user) {
    const u = response.data.data.user;
    return {
      id: u.id || "",
      email: u.email,
      name: u.name || u.userName || u.email.split("@")[0],
    };
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
  }
};
