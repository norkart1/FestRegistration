import { apiRequest } from "./queryClient";

export interface AuthUser {
  id: string;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: AuthUser }> => {
    const response = await apiRequest("POST", "/api/auth/login", credentials);
    return response.json();
  },

  logout: async (): Promise<void> => {
    await apiRequest("POST", "/api/auth/logout");
  },

  checkAuth: async (): Promise<{ authenticated: boolean }> => {
    const response = await apiRequest("GET", "/api/auth/me");
    return response.json();
  }
};
