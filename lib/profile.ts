export interface ContactUser {
  primaryEmailAddress?: {
    emailAddress: string;
    verification: { status: string | null };
  } | null;
  primaryPhoneNumber?: {
    phoneNumber: string;
    verification: { status: string | null };
  } | null;
}

export interface UserContact {
  email: string | null;
  emailVerified: boolean;
  phone: string | null;
  phoneVerified: boolean;
}

export function getUserContact(user: ContactUser | null | undefined): UserContact {
  const email = user?.primaryEmailAddress;
  const phone = user?.primaryPhoneNumber;
  return {
    email: email?.emailAddress ?? null,
    emailVerified: email?.verification.status === "verified",
    phone: phone?.phoneNumber ?? null,
    phoneVerified: phone?.verification.status === "verified",
  };
}

export function isProfileComplete(user: ContactUser | null | undefined): boolean {
  const contact = getUserContact(user);
  return Boolean(contact.emailVerified && contact.phoneVerified);
}
