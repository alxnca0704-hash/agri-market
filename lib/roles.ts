export type Role = "buyer" | "seller";

export const ROLES: readonly Role[] = ["buyer", "seller"];

export const ROLE_HOME: Record<Role, string> = {
  buyer: "/buyer/dashboard",
  seller: "/seller/products",
};

export interface RoleUser {
  publicMetadata?: Record<string, unknown>;
}

export function getRole(user: RoleUser | null | undefined): Role {
  return user?.publicMetadata?.role === "seller" ? "seller" : "buyer";
}

export function getRoleMetadata(user: RoleUser | null | undefined): Role | null {
  const role = user?.publicMetadata?.role;
  return role === "seller" || role === "buyer" ? role : null;
}
