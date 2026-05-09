"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { findUserByPassword, getRoleHomePath } from "../../lib/auth";
import { SESSION_COOKIE_NAME, signSessionToken } from "../../lib/session";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!password.trim()) {
    redirect("/?error=invalid_credentials");
  }

  const user = await findUserByPassword(password);
  if (!user) {
    redirect("/?error=invalid_credentials");
  }

  const token = await signSessionToken({
    userId: user.id,
    role: user.role,
    name: user.name,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  if (user.role === "ADMIN" && user.mustChangePassword) {
    redirect("/admin/settings");
  }

  redirect(getRoleHomePath(user.role));
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/");
}
