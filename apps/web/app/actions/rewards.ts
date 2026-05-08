"use server";

import { redirect } from "next/navigation";
import { db } from "../../lib/db";
import { getCurrentUser } from "../../lib/auth";

export async function createRewardAction(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/");
  }

  const name = formData.get("name")?.toString().trim() || "";
  const costStr = formData.get("cost")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";

  // Validation
  if (!name) {
    throw new Error("Назва нагороди не може бути порожною");
  }

  const cost = parseInt(costStr, 10);
  if (isNaN(cost) || cost <= 0) {
    throw new Error("Вартість повинна бути позитивним числом");
  }

  const reward = await db.rewardDefinition.create({
    data: {
      name,
      cost,
      description,
      active: true,
    },
  });

  return reward;
}

export async function updateRewardAction(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/");
  }

  const id = formData.get("id")?.toString().trim() || "";
  const name = formData.get("name")?.toString().trim() || "";
  const costStr = formData.get("cost")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";

  // Validation
  if (!id) {
    throw new Error("ID нагороди необхідний");
  }

  if (!name) {
    throw new Error("Назва нагороди не може бути порожною");
  }

  const cost = parseInt(costStr, 10);
  if (isNaN(cost) || cost <= 0) {
    throw new Error("Вартість повинна бути позитивним числом");
  }

  // Check if reward exists
  const existingReward = await db.rewardDefinition.findUnique({
    where: { id },
  });

  if (!existingReward) {
    throw new Error("Нагорода не знайдена");
  }

  const reward = await db.rewardDefinition.update({
    where: { id },
    data: {
      name,
      cost,
      description,
    },
  });

  return reward;
}

export async function deactivateRewardAction(id: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/");
  }

  if (!id) {
    throw new Error("ID нагороди необхідний");
  }

  const existingReward = await db.rewardDefinition.findUnique({
    where: { id },
  });

  if (!existingReward) {
    throw new Error("Нагорода не знайдена");
  }

  const reward = await db.rewardDefinition.update({
    where: { id },
    data: {
      active: false,
    },
  });

  return reward;
}

export async function getRewards() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/");
  }

  const rewards = await db.rewardDefinition.findMany({
    orderBy: { createdAt: "desc" },
  });

  return rewards;
}
