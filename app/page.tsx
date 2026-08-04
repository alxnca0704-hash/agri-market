"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getRoleMetadata, ROLE_HOME } from "@/lib/roles";

export default function Home() {
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
    const role = getRoleMetadata(user);
    if (role === null) {
      router.replace("/onboarding");
    } else {
      router.replace(ROLE_HOME[role]);
    }
  }, [isLoaded, isSignedIn, user, router]);

  return null;
}
