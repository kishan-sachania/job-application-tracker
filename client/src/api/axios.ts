import axios from "axios";

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? "https://job-application-tracker-8y1l.onrender.com/api"
    : "/api");
const API_BASE_URL = rawBaseUrl.endsWith("/")
  ? rawBaseUrl.slice(0, -1)
  : rawBaseUrl;

// client
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

api.interceptors.request.use(
  (config) => {
    const token = getCookie("job_tracker_token");
    const userStr = localStorage.getItem("job_tracker_user");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const userId = user.id;
        if (userId) {
          config.headers["x-user-id"] = userId;
        }
      } catch {
        // Ignore JSON parse errors
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register") &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = localStorage.getItem("job_tracker_refresh_token");
        if (!storedRefreshToken) {
          throw new Error("No refresh token available");
        }

        const refreshRes = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken: storedRefreshToken },
          { withCredentials: true }
        );

        const newAccessToken = refreshRes.data?.data?.accessToken;
        if (!newAccessToken) {
          throw new Error("Token refresh returned empty access token");
        }

        localStorage.setItem("job_tracker_token", newAccessToken);
        document.cookie = `job_tracker_token=${encodeURIComponent(newAccessToken)}; path=/; SameSite=Lax`;

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("job_tracker_token");
        localStorage.removeItem("job_tracker_refresh_token");
        localStorage.removeItem("job_tracker_user");
        document.cookie = "job_tracker_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";

        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
