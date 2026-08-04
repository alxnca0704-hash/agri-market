import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getRoleMetadata } from "@/lib/roles";
import ProfileClient from "@/components/profile/ProfileClient";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  if (!getRoleMetadata(user)) {
    redirect("/onboarding");
  }

  return <ProfileClient />;
}
