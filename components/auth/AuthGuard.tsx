"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getRoleMetadata, type Role } from "@/lib/roles";

export default function AuthGuard({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    if (!isSignedIn) {
      router.replace("/login");
      return;
    }
    const current = getRoleMetadata(user);
    if (current === null) {
      router.replace("/onboarding");
    } else if (current !== role) {
      router.replace("/login");
    }
  }, [isLoaded, isSignedIn, user, role, router]);

  if (!isLoaded || !isSignedIn || getRoleMetadata(user) !== role) {
    return null;
  }

  return <>{children}</>;
}
