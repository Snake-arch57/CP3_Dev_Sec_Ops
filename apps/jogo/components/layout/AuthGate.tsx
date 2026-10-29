"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { usePlayerProfile } from "@/lib/hooks/usePlayerProfile";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: profile, isLoading } = usePlayerProfile();

  useEffect(() => {
    if (isLoading) return;
    if (profile === null) {
      router.replace("/login");
    } else if (profile?.mustChangePassword) {
      router.replace("/change-password");
    }
  }, [isLoading, profile, router]);

  if (isLoading || !profile || profile.mustChangePassword) {
    return (
      <div className="flex min-h-dvh items-center justify-center gap-2 text-text-muted">
        <ShieldCheck className="h-5 w-5 animate-pulse text-primary" />
        Carregando...
      </div>
    );
  }

  return <>{children}</>;
}
