"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, type BootstrapAdminPayload, type ChangePasswordPayload, type LoginPayload } from "@/lib/api/auth";
import { queryKeys } from "@/lib/query/keys";

export function useAuthStatus() {
  return useQuery({
    queryKey: ["auth-status"],
    queryFn: () => authApi.status(),
    staleTime: Infinity,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.playerProfile, profile);
    },
  });
}

export function useBootstrapAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BootstrapAdminPayload) => authApi.bootstrapAdmin(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.playerProfile, profile);
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => authApi.changePassword(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.playerProfile, profile);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.playerProfile, null);
    },
  });
}
