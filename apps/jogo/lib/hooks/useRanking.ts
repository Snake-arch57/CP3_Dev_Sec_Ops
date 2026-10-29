"use client";

import { useQuery } from "@tanstack/react-query";
import { rankingApi } from "@/lib/api/ranking";

export function useRanking() {
  return useQuery({
    queryKey: ["ranking"],
    queryFn: () => rankingApi.get(),
  });
}
