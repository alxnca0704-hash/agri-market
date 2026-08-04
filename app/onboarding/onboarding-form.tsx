"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Divider, Input, Spin, Tag } from "antd";
import {
  CheckCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  RightOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useUser } from "@clerk/nextjs";
import type { EmailAddressResource, PhoneNumberResource } from "@clerk/shared/types";
import { ROLES, ROLE_HOME, type Role } from "@/lib/roles";
import { setUserRole } from "./actions";

const ROLE_META: Record<
  Role,
  { icon: React.ReactNode; title: string; description: string }
> = {
  buyer: {
    icon: <ShoppingCartOutlined />,
    title: "Buyer account",
    description: "Browse the marketplace, buy supplies, and track your orders.",
  },
  seller: {
    icon: <ShopOutlined />,
    title: "Seller account",
    description: "List products and manage what you sell to the community.",
  },
};

function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden>
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

export default function OnboardingFlow() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { message } = App.useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role | null>(null);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [showAddEmail, setShowAddEmail] = useState(false);
  const [addingEmail, setAddingEmail] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [verifyTarget, setVerifyTarget] = useState<EmailAddressResource | null>(null);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  const [phoneInput, setPhoneInput] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneTarget, setPhoneTarget] = useState<PhoneNumberResource | null>(null);
  const [sendingPhoneCode, setSendingPhoneCode] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  if (!isLoaded) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-green-50 via-paper to-paper">
        <Spin size="large" />
      </main>
    );
  }

  if (!isSignedIn || !user) {
    return null;
  }

  const currentUser = user;

  const primaryEmail = user.primaryEmailAddress;
  const primaryEmailVerified = primaryEmail?.verification.status === "verified";
  const primaryPhone = user.primaryPhoneNumber;
  const primaryPhoneVerified = primaryPhone?.verification.status === "verified";
  const emailVerified = primaryEmailVerified && !verifyTarget;

  async function sendCodeFor(email: EmailAddressResource) {
    setSendingCode(true);
    try {
      await email.prepareVerification({ strategy: "email_code" });
      setVerifyTarget(email);
      setEmailCode("");
      message.info("We sent a 6-digit code to that email address");
    } catch {
      message.error("Couldn't send a verification code");
    } finally {
      setSendingCode(false);
    }
  }

  async function handleAddEmail() {
    if (!newEmail.trim()) return;
    setAddingEmail(true);
    try {
      const email = await currentUser.createEmailAddress({ email: newEmail.trim() });
      await sendCodeFor(email);
    } catch {
      message.error("That email couldn't be added");
    } finally {
      setAddingEmail(false);
    }
  }

  async function handleVerifyEmail() {
    if (!verifyTarget) return;
    setVerifyingEmail(true);
    try {
      await verifyTarget.attemptVerification({ code: emailCode });
      if (verifyTarget.id !== currentUser.primaryEmailAddress?.id) {
        await currentUser.update({ primaryEmailAddressId: verifyTarget.id });
      }
      await currentUser.reload();
      setVerifyTarget(null);
      setShowAddEmail(false);
      setNewEmail("");
      message.success("Email verified");
    } catch {
      message.error("That code wasn't correct");
    } finally {
      setVerifyingEmail(false);
    }
  }

  async function sendPhoneCode(phone: PhoneNumberResource) {
    setSendingPhoneCode(true);
    try {
      await phone.prepareVerification();
      setPhoneTarget(phone);
      setPhoneCode("");
      message.info("We sent an SMS code to that number");
    } catch {
      message.error("Couldn't send a verification code");
    } finally {
      setSendingPhoneCode(false);
    }
  }

  async function handleAddPhone() {
    if (!phoneInput.trim()) return;
    setSendingPhoneCode(true);
    try {
      const phone = await currentUser.createPhoneNumber({ phoneNumber: phoneInput.trim() });
      await phone.prepareVerification();
      setPhoneTarget(phone);
      setPhoneCode("");
      message.info("We sent an SMS code to that number");
    } catch {
      message.error("That phone number couldn't be added");
    } finally {
      setSendingPhoneCode(false);
    }
  }

  async function handleVerifyPhone() {
    if (!phoneTarget) return;
    setVerifyingPhone(true);
    try {
      await phoneTarget.attemptVerification({ code: phoneCode });
      if (phoneTarget.id !== currentUser.primaryPhoneNumber?.id) {
        await currentUser.update({ primaryPhoneNumberId: phoneTarget.id });
      }
      await currentUser.reload();
      setPhoneTarget(null);
      setPhoneInput("");
      setPhoneCode("");
      message.success("Phone number verified");
    } catch {
      message.error("That code wasn't correct");
    } finally {
      setVerifyingPhone(false);
    }
  }

  async function handleSelectRole(next: Role) {
    setPendingRole(next);
    try {
      await setUserRole(next);
      await currentUser.reload();
      setRole(next);
      setStep(2);
    } catch {
      message.error("Couldn't save your role");
    } finally {
      setPendingRole(null);
    }
  }

  async function handleFinish() {
    if (role) {
      await currentUser.reload();
      router.push(ROLE_HOME[role]);
    }
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-green-50 via-paper to-paper px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 shadow-soft">
            <BrandMark />
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
            Finish setting up your account
          </h1>
          <p className="mt-1.5 max-w-sm text-sm text-gray-500">
            {step === 1
              ? "Choose how you'll use AgriMarket."
              : "Add a way for buyers and sellers to reach you. You can skip this for now."}
          </p>
        </div>

        {step === 1 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ROLES.map((candidate) => {
              const meta = ROLE_META[candidate];
              return (
                <button
                  key={candidate}
                  type="button"
                  onClick={() => handleSelectRole(candidate)}
                  disabled={pendingRole !== null}
                  className="group flex items-start gap-3 rounded-2xl bg-paper p-4 text-left shadow-soft ring-1 ring-gray-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-800">
                    {meta.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-gray-900">
                      {meta.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-gray-500">
                      {meta.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl bg-paper p-6 shadow-soft ring-1 ring-gray-200/50 sm:p-7">
            <section aria-label="Email">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <MailOutlined className="text-gray-400" />
                Email
              </div>

              {primaryEmail ? (
                <div className="mb-3 rounded-xl bg-gray-50 px-3.5 py-3 ring-1 ring-gray-200/50">
                  <span className="text-sm text-gray-800">
                    {primaryEmail.emailAddress}
                  </span>
                  {emailVerified ? (
                    <span className="ml-2">
                      <Tag icon={<CheckCircleOutlined />} color="success">
                        Verified
                      </Tag>
                    </span>
                  ) : (
                    <span className="ml-2">
                      <Tag color="warning">Not verified</Tag>
                    </span>
                  )}
                </div>
              ) : (
                <p className="mb-3 text-sm text-gray-500">No email on file yet.</p>
              )}

              {primaryEmail && !emailVerified && !verifyTarget && (
                <Button
                  onClick={() => sendCodeFor(primaryEmail)}
                  loading={sendingCode}
                  className="mb-2"
                >
                  Verify email
                </Button>
              )}

              {primaryEmail && !showAddEmail && !verifyTarget && (
                <Button type="link" className="px-0" onClick={() => setShowAddEmail(true)}>
                  Add another email
                </Button>
              )}

              {!primaryEmail && !showAddEmail && !verifyTarget && (
                <div className="mb-2 flex flex-col gap-2 sm:flex-row">
                  <Input
                    placeholder="you@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <Button onClick={handleAddEmail} loading={addingEmail}>
                    Add email
                  </Button>
                </div>
              )}

              {showAddEmail && !verifyTarget && (
                <div className="mb-2 flex flex-col gap-2 sm:flex-row">
                  <Input
                    placeholder="you@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <Button onClick={handleAddEmail} loading={addingEmail}>
                    Add email
                  </Button>
                </div>
              )}

              {verifyTarget && (
                <div className="mb-2 flex flex-col gap-2 sm:flex-row">
                  <Input
                    placeholder="6-digit code"
                    inputMode="numeric"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                  />
                  <Button
                    onClick={handleVerifyEmail}
                    loading={verifyingEmail}
                    type="primary"
                  >
                    Confirm code
                  </Button>
                </div>
              )}
            </section>

            <Divider className="my-5" />

            <section aria-label="Phone">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <PhoneOutlined className="text-gray-400" />
                Phone number
              </div>

              {primaryPhone && primaryPhoneVerified ? (
                <div className="mb-3 rounded-xl bg-gray-50 px-3.5 py-3 ring-1 ring-gray-200/50">
                  <span className="text-sm text-gray-800">
                    {primaryPhone.phoneNumber}
                  </span>
                  <span className="ml-2">
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      Verified
                    </Tag>
                  </span>
                </div>
              ) : (
                <>
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row">
                    <Input
                      placeholder="+63 912 345 6789"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                    />
                    <Button
                      onClick={primaryPhone ? () => sendPhoneCode(primaryPhone) : handleAddPhone}
                      loading={sendingPhoneCode}
                    >
                      {primaryPhone ? "Verify number" : "Add phone"}
                    </Button>
                  </div>
                  {phoneTarget && (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        placeholder="6-digit code"
                        inputMode="numeric"
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value)}
                      />
                      <Button
                        onClick={handleVerifyPhone}
                        loading={verifyingPhone}
                        type="primary"
                      >
                        Confirm code
                      </Button>
                    </div>
                  )}
                </>
              )}
            </section>

            <Button
              type="primary"
              size="large"
              block
              icon={<RightOutlined />}
              iconPlacement="end"
              className="mt-6"
              onClick={handleFinish}
            >
              Continue to {role ? ROLE_META[role].title.replace(" account", "") : "your account"}
            </Button>
            <p className="mt-3 text-center text-xs text-gray-400">
              You can update your contact details anytime from your profile.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
