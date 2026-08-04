import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";

export const metadata: Metadata = { title: "Sign up" };

export default function SignUpPage() {
  return <AuthShell mode="sign-up" />;
}
