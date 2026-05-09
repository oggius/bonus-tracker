import "server-only";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { Role } from "@bonus-tracker/db";
import { db } from "./db";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./session";

export type AuthUser = {
  id: string;
  name: string;
  role: Role;
  mustChangePassword: boolean;
};

export function getRoleHomePath(role: Role) {
  return role === "ADMIN" ? "/admin" : "/user";
}

export async function findUserByPassword(password: string): Promise<AuthUser | null> {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
      passwordHash: true,
      mustChangePassword: true,
    },
  });

  for (const user of users) {
    const matches = await bcrypt.compare(password, user.passwordHash);
    if (matches) {
      return {
        id: user.id,
        name: user.name,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      };
    }
  }

  return null;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const payload = await verifySessionToken(token);
  if (!payload?.sub) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      name: true,
      role: true,
      mustChangePassword: true,
    },
  });

  return user;
}

type RequireAdminOptions = {
  allowMustChangePassword?: boolean;
};

export async function requireAdminUser(
  options: RequireAdminOptions = {}
): Promise<AuthUser> {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/");
  }

  if (currentUser.mustChangePassword && !options.allowMustChangePassword) {
    redirect("/admin/settings");
  }

  return currentUser;
}
