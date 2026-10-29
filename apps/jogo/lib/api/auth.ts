import { api } from "./client";
import type { PlayerProfile } from "./types";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface BootstrapAdminPayload {
  username: string;
  password: string;
  displayName: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  status: () => api.get<{ needsBootstrap: boolean }>("/auth/status"),
  login: (payload: LoginPayload) => api.post<PlayerProfile>("/auth/login", payload),
  bootstrapAdmin: (payload: BootstrapAdminPayload) =>
    api.post<PlayerProfile>("/auth/bootstrap-admin", payload),
  changePassword: (payload: ChangePasswordPayload) =>
    api.post<PlayerProfile>("/auth/change-password", payload),
  logout: () => api.post<{ ok: true }>("/auth/logout"),
};
