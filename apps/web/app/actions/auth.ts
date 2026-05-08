"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { findUserByPin } from "../../lib/auth";
import { SESSION_COOKIE_NAME, signSessionToken } from "../../lib/session";

export async function loginWithPinAction(formData: FormData) {
  const pin = String(formData.get("pin") ?? "").trim();

  if (!/^\d{4}$/.test(pin)) {
    redirect("/?error=invalid_pin");
  }

  const user = await findUserByPin(pin);
  if (!user) {
    redirect("/?error=invalid_pin");
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
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/");
}
