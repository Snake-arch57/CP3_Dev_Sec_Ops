"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi, type CreateEmployeePayload } from "@/lib/api/admin";

const EMPLOYEES_KEY = ["admin", "employees"];

export function useEmployees() {
  return useQuery({
    queryKey: EMPLOYEES_KEY,
    queryFn: () => adminApi.listEmployees(),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => adminApi.createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
    },
  });
}

export function useResetEmployeePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (employeeId: string) => adminApi.resetPassword(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (employeeId: string) => adminApi.deleteEmployee(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
    },
  });
}
