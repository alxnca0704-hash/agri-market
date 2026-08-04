import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getRoleMetadata, ROLE_HOME } from "@/lib/roles";
import OnboardingFlow from "./onboarding-form";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/signup");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = getRoleMetadata(user);
  if (role) {
    redirect(ROLE_HOME[role]);
  }

  return <OnboardingFlow />;
}
