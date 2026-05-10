"use server";

import { db } from "../../lib/db";
import { requireAdminUser } from "../../lib/auth";

async function assertAdmin() {
  return requireAdminUser();
}

function parsePoints(pointsRaw: string) {
  const points = Number.parseInt(pointsRaw, 10);

  if (!Number.isFinite(points) || points <= 0) {
    throw new Error("Кількість очок має бути додатним цілим числом");
  }

  return points;
}

function parseDescription(descriptionRaw: string) {
  const description = descriptionRaw.trim();

  if (!description) {
    throw new Error("Опис активності не може бути порожнім");
  }

  return description;
}

export async function getActivitiesForAdmin() {
  await assertAdmin();

  return db.activity.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getActivitiesForUser() {
  return db.activity.findMany({
    select: {
      id: true,
      description: true,
      points: true,
      order: true,
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function createActivityAction(formData: FormData) {
  await assertAdmin();

  const description = parseDescription(String(formData.get("description") ?? ""));
  const points = parsePoints(String(formData.get("points") ?? ""));

  const lastActivity = await db.activity.findFirst({
    select: { order: true },
    orderBy: { order: "desc" },
  });

  return db.activity.create({
    data: {
      description,
      points,
      order: (lastActivity?.order ?? -1) + 1,
    },
  });
}

export async function updateActivityAction(formData: FormData) {
  await assertAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const description = parseDescription(String(formData.get("description") ?? ""));
  const points = parsePoints(String(formData.get("points") ?? ""));

  if (!id) {
    throw new Error("ID активності обов'язковий");
  }

  const existingActivity = await db.activity.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingActivity) {
    throw new Error("Активність не знайдена");
  }

  return db.activity.update({
    where: { id },
    data: {
      description,
      points,
    },
  });
}

export async function deleteActivityAction(id: string) {
  await assertAdmin();

  const trimmedId = id.trim();
  if (!trimmedId) {
    throw new Error("ID активності обов'язковий");
  }

  const deleted = await db.activity.delete({
    where: { id: trimmedId },
    select: { id: true },
  });

  const remaining = await db.activity.findMany({
    select: { id: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  if (remaining.length) {
    await db.$transaction(
      remaining.map((activity, index) =>
        db.activity.update({
          where: { id: activity.id },
          data: { order: index },
        })
      )
    );
  }

  return deleted;
}

export async function reorderActivitiesAction(activityIds: string[]) {
  await assertAdmin();

  if (!Array.isArray(activityIds) || activityIds.length === 0) {
    throw new Error("Список активностей порожній");
  }

  const uniqueIds = Array.from(new Set(activityIds.map((id) => id.trim()).filter(Boolean)));

  const existingActivities = await db.activity.findMany({
    select: { id: true },
  });

  if (uniqueIds.length !== existingActivities.length) {
    throw new Error("Некоректний список активностей");
  }

  const knownIds = new Set(existingActivities.map((activity) => activity.id));
  if (uniqueIds.some((id) => !knownIds.has(id))) {
    throw new Error("Некоректний список активностей");
  }

  await db.$transaction(
    uniqueIds.map((id, index) =>
      db.activity.update({
        where: { id },
        data: { order: index },
      })
    )
  );
}
