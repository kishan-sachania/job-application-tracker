import React, { createContext, useContext, useState } from "react";
import type { User } from "../types";
import { logoutApi } from "../api/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const removeCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("job_tracker_user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem("job_tracker_user");
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    const cookieToken = getCookie("job_tracker_token");
    if (cookieToken) {
      return cookieToken;
    }
    const storedToken = localStorage.getItem("job_tracker_token");
    if (storedToken) {
      setCookie("job_tracker_token", storedToken);
      return storedToken;
    }
    return null;
  });

  const [loading] = useState<boolean>(false);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    setCookie("job_tracker_token", authToken);
    localStorage.setItem("job_tracker_token", authToken);
    localStorage.setItem("job_tracker_user", JSON.stringify(userData));
  };

  const logout = () => {
    logoutApi().catch(() => {});
    setUser(null);
    setToken(null);
    removeCookie("job_tracker_token");
    localStorage.removeItem("job_tracker_token");
    localStorage.removeItem("job_tracker_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
