"use client";

import { Alert, Spin } from "antd";
import { UserProfile, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { profileAppearance } from "@/components/auth/clerkAppearance";
import { isProfileComplete } from "@/lib/profile";
import { getRole, ROLE_HOME } from "@/lib/roles";

function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-4.5 w-4.5" aria-hidden>
      <path
        d="M32 50v-16"
        stroke="#fbfaf8"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M32 34c0-8-6-13-14-13 0 8 6 13 14 13z" fill="#fbfaf8" />
      <path d="M32 34c0-8 6-13 14-13 0 8-6 13-14 13z" fill="#fbfaf8" />
    </svg>
  );
}

export default function ProfileClient() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center py-24">
        <Spin size="large" />
      </div>
    );
  }

  const incomplete = !isProfileComplete(user);
  const backHref = ROLE_HOME[getRole(user)];

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-clip bg-mist">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200/70 bg-paper/85 px-4 backdrop-blur-md sm:px-6">
        <Link href={backHref} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-600 shadow-soft">
            <BrandMark />
          </span>
          <span className="hidden text-lg font-semibold tracking-tight text-gray-900 sm:block">
            AgriMarket
          </span>
        </Link>
        <Link
          href={backHref}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100/80 hover:text-gray-900"
        >
          Back to dashboard
        </Link>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 text-balance sm:text-3xl">
          Profile
        </h1>

        {incomplete && (
          <Alert
            type="warning"
            showIcon
            title="Complete your profile"
            description="Add and verify an email address and phone number so buyers and sellers can reach you."
            className="mb-6"
          />
        )}

        <UserProfile
          appearance={profileAppearance}
          routing="path"
          path="/profile"
        />
      </main>
    </div>
  );
}
