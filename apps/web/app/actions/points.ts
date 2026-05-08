"use server";

import { redirect } from "next/navigation";

import { db } from "../../lib/db";
import { getCurrentUser } from "../../lib/auth";

const POINT_ACTION_TYPES = new Set(["award", "deduct"]);

async function assertAdmin() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/");
  }

  return currentUser;
}

async function getUserBalance(userId: string) {
  const [pointsAgg, exchangesAgg] = await Promise.all([
    db.pointsLog.aggregate({
      where: { userId },
      _sum: { delta: true },
    }),
    db.exchange.aggregate({
      where: { userId },
      _sum: { costSnapshot: true },
    }),
  ]);

  const pointsTotal = pointsAgg._sum.delta ?? 0;
  const exchangeTotal = exchangesAgg._sum.costSnapshot ?? 0;

  return pointsTotal - exchangeTotal;
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
      createdById: currentUser.id,
    },
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
