"use server";

import { redirect } from "next/navigation";

import { db } from "../../lib/db";
import { getCurrentUser } from "../../lib/auth";
import { getUserBalance } from "../../lib/balance";

async function assertUser() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "USER") {
    redirect("/");
  }

  return currentUser;
}

export async function createExchangeAction(formData: FormData) {
  const currentUser = await assertUser();

  const rewardId = String(formData.get("rewardId") ?? "").trim();

  if (!rewardId) {
    throw new Error("Нагорода не знайдена");
  }

  const reward = await db.rewardDefinition.findUnique({
    where: { id: rewardId },
    select: {
      id: true,
      name: true,
      cost: true,
      active: true,
    },
  });

  if (!reward || !reward.active) {
    throw new Error("Нагорода недоступна");
  }

  const balance = await getUserBalance(currentUser.id);
  if (balance < reward.cost) {
    throw new Error("Недостатньо очок для обміну");
  }

  const commentRaw = String(formData.get("comment") ?? "").trim();

  await db.exchange.create({
    data: {
      userId: currentUser.id,
      rewardId: reward.id,
      costSnapshot: reward.cost,
      comment: commentRaw || null,
    },
  });
}

export async function updateExchangeCommentAction(formData: FormData) {
  const currentUser = await assertUser();

  const exchangeId = String(formData.get("exchangeId") ?? "").trim();
  if (!exchangeId) {
    throw new Error("Обмін не знайдено");
  }

  const exchange = await db.exchange.findUnique({
    where: { id: exchangeId },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!exchange || exchange.userId !== currentUser.id) {
    throw new Error("Обмін не знайдено");
  }

  const commentRaw = String(formData.get("comment") ?? "").trim();

  await db.exchange.update({
    where: { id: exchange.id },
    data: {
      comment: commentRaw || null,
    },
  });
}
