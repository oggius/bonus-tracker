"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { db } from "../../lib/db";
import { requireAdminUser } from "../../lib/auth";

function validateNewPassword(password: string, confirmPassword: string) {
  if (!password) {
    throw new Error("Новий пароль не може бути порожнім");
  }

  if (password !== confirmPassword) {
    throw new Error("Підтвердження пароля не співпадає");
  }
}

export async function changeAdminPasswordAction(formData: FormData) {
  const currentUser = await requireAdminUser({ allowMustChangePassword: true });

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword) {
    throw new Error("Поточний пароль є обов'язковим");
  }

  validateNewPassword(newPassword, confirmPassword);

  const adminRecord = await db.user.findUnique({
    where: { id: currentUser.id },
    select: { id: true, passwordHash: true },
  });

  if (!adminRecord) {
    redirect("/");
  }

  const matchesCurrentPassword = await bcrypt.compare(currentPassword, adminRecord.passwordHash);
  if (!matchesCurrentPassword) {
    throw new Error("Поточний пароль невірний");
  }

  if (currentPassword === newPassword) {
    throw new Error("Новий пароль має відрізнятися від поточного");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: { id: adminRecord.id },
    data: {
      passwordHash,
      mustChangePassword: false,
    },
  });
}

export async function setUserPasswordAction(formData: FormData) {
  await requireAdminUser();

  const userId = String(formData.get("userId") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!userId) {
    throw new Error("Користувача не знайдено");
  }

  validateNewPassword(newPassword, confirmPassword);

  const targetUser = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!targetUser || targetUser.role !== "USER") {
    throw new Error("Користувача не знайдено");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: { id: targetUser.id },
    data: { passwordHash },
  });
}
