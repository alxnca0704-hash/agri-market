"use server";

import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { ROLES, type Role } from "@/lib/roles";

export async function setUserRole(role: Role): Promise<void> {
  const { userId } = await auth();
  if (!userId) {
    redirect("/signup");
  }
  if (!ROLES.includes(role)) {
    return;
  }

  const client = await clerkClient();
  const existing = await client.users.getUser(userId);
  await client.users.updateUser(userId, {
    publicMetadata: { ...existing.publicMetadata, role },
  });
}
