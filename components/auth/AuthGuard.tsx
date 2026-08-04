"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/auth-core";

export default function AuthGuard({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) {
      return;
    }
    if (!user || user.role !== role) {
      router.replace("/login");
    }
  }, [ready, user, role, router]);

  if (!ready || !user || user.role !== role) {
    return null;
  }

  return <>{children}</>;
}
