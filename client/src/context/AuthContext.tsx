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
    return localStorage.getItem("job_tracker_token");
  });

  const [loading] = useState<boolean>(false);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("job_tracker_token", authToken);
    localStorage.setItem("job_tracker_user", JSON.stringify(userData));
  };

  const logout = () => {
    logoutApi().catch(() => {});
    setUser(null);
    setToken(null);
    localStorage.removeItem("job_tracker_token");
    localStorage.removeItem("job_tracker_refresh_token");
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
