import { api } from "./client";
import type { CreateEmployeeResponse, Employee } from "./types";

export interface CreateEmployeePayload {
  username: string;
  displayName: string;
  department: string;
  password: string;
}

export const adminApi = {
  listEmployees: () => api.get<Employee[]>("/admin/employees"),
  createEmployee: (payload: CreateEmployeePayload) =>
    api.post<CreateEmployeeResponse>("/admin/employees", payload),
  resetPassword: (employeeId: string) =>
    api.post<{ temporaryPassword: string }>(`/admin/employees/${employeeId}/reset-password`),
  deleteEmployee: (employeeId: string) => api.delete<{ ok: true }>(`/admin/employees/${employeeId}`),
};
