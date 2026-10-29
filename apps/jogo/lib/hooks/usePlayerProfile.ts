"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { playersApi } from "@/lib/api/players";
import { upgradesApi } from "@/lib/api/upgrades";
import { phasesApi, type SavePhaseResultPayload } from "@/lib/api/phases";
import { queryKeys } from "@/lib/query/keys";

export function usePlayerProfile() {
  return useQuery({
    queryKey: queryKeys.playerProfile,
    queryFn: () => playersApi.me(),
  });
}

export function usePurchaseUpgrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (upgradeId: string) => upgradesApi.purchase(upgradeId),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.playerProfile, profile);
    },
  });
}

export function useSavePhaseResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (result: SavePhaseResultPayload) => phasesApi.saveResult(result),
    onSuccess: ({ profile }) => {
      queryClient.setQueryData(queryKeys.playerProfile, profile);
    },
  });
}
