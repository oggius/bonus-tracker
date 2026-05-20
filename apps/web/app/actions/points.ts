"use server";

import { revalidatePath } from "next/cache";

import { db } from "../../lib/db";
import { getCurrentUser, requireAdminUser } from "../../lib/auth";
import { getUserBalance } from "../../lib/balance";
import { sendPushToAdmins } from "../../lib/web-push";

const POINT_ACTION_TYPES = new Set(["award", "deduct"]);

async function assertAdmin() {
  return requireAdminUser();
}

async function assertUser() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "USER") {
    throw new Error("Недостатньо прав доступу");
  }

  return currentUser;
}

export async function createPointsLogAction(formData: FormData) {
  const currentUser = await assertAdmin();

  const userId = String(formData.get("userId") ?? "").trim();
  const actionType = String(formData.get("actionType") ?? "").trim();
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!userId) {
    throw new Error("Оберіть користувача");
  }

  if (!POINT_ACTION_TYPES.has(actionType)) {
    throw new Error("Невірний тип операції");
  }

  const amount = Number.parseInt(amountRaw, 10);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Кількість очок має бути додатним цілим числом");
  }

  if (!description) {
    throw new Error("Опис операції є обов'язковим");
  }

  const targetUser = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!targetUser || targetUser.role !== "USER") {
    throw new Error("Користувач не знайдений");
  }

  let delta = amount;
  if (actionType === "deduct") {
    const balance = await getUserBalance(userId);
    if (balance < amount) {
      throw new Error("Недостатньо очок для списання");
    }
    delta = -amount;
  }

  await db.pointsLog.create({
    data: {
      userId,
      delta,
      description,
      status: "APPROVED",
      initiatedBy: "ADMIN",
      createdById: currentUser.id,
    },
  });
}

export async function createPointsRequestAction(formData: FormData) {
  const currentUser = await assertUser();

  const amountRaw = String(formData.get("amount") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  const amount = Number.parseInt(amountRaw, 10);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Кількість очок має бути додатним цілим числом");
  }

  if (!description) {
    throw new Error("Опишіть активність, за яку ви просите очки");
  }

  await db.pointsLog.create({
    data: {
      userId: currentUser.id,
      delta: amount,
      description,
      status: "PENDING",
      initiatedBy: "USER",
    },
  });

  revalidatePath("/admin", "layout");

  try {
    await sendPushToAdmins({
      title: "Новий запит на очки",
      body: `${currentUser.name} просить ${amount} очок: ${description}`,
      url: "/admin/points",
    });
  } catch (error) {
    console.error("[points] failed to send push notification", error);
  }
}

export async function approvePointsRequestAction(requestId: string) {
  const currentUser = await assertAdmin();

  const request = await db.pointsLog.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      status: true,
      initiatedBy: true,
    },
  });

  if (!request || request.status !== "PENDING" || request.initiatedBy !== "USER") {
    throw new Error("Запит не знайдено або вже оброблено");
  }

  await db.pointsLog.update({
    where: { id: request.id },
    data: {
      status: "APPROVED",
      createdById: currentUser.id,
    },
  });

  revalidatePath("/admin", "layout");
}

export async function rejectPointsRequestAction(requestId: string) {
  const currentUser = await assertAdmin();

  const request = await db.pointsLog.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      status: true,
      initiatedBy: true,
    },
  });

  if (!request || request.status !== "PENDING" || request.initiatedBy !== "USER") {
    throw new Error("Запит не знайдено або вже оброблено");
  }

  await db.pointsLog.update({
    where: { id: request.id },
    data: {
      status: "REJECTED",
      createdById: currentUser.id,
    },
  });

  revalidatePath("/admin", "layout");
}

export async function getPendingPointsRequestsForUser() {
  const currentUser = await assertUser();

  return db.pointsLog.findMany({
    where: {
      userId: currentUser.id,
      status: "PENDING",
      initiatedBy: "USER",
    } as any,
    select: {
      id: true,
      delta: true,
      description: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPendingPointsRequestsForAdmin() {
  await assertAdmin();

  return db.pointsLog.findMany({
    where: {
      status: "PENDING",
      initiatedBy: "USER",
    } as any,
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getUsersForPointsAdmin() {
  await assertAdmin();

  return db.user.findMany({
    where: { role: "USER" },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getPointsHistoryForAdmin() {
  await assertAdmin();

  return db.pointsLog.findMany({
    where: {
      NOT: { status: "PENDING" },
    } as any,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getUserBalanceForAdmin(userId: string) {
  await assertAdmin();

  return getUserBalance(userId);
}
