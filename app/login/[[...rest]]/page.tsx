import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return <AuthShell mode="sign-in" />;
}
