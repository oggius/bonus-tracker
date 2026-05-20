"use server";

import { db } from "../../lib/db";
import { requireAdminUser } from "../../lib/auth";
import { parsePushSubscription } from "../../lib/push-subscription";

export async function subscribeToPushAction(rawSubscription: unknown) {
  const currentUser = await requireAdminUser();
  const subscription = parsePushSubscription(rawSubscription);

  await db.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    create: {
      userId: currentUser.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    update: {
      userId: currentUser.id,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  });
}

export async function unsubscribeFromPushAction(endpoint: string) {
  await requireAdminUser();

  if (!endpoint) {
    return;
  }

  await db.pushSubscription
    .delete({ where: { endpoint } })
    .catch(() => undefined);
}

export async function hasPushSubscriptionForEndpoint(endpoint: string) {
  await requireAdminUser();

  if (!endpoint) {
    return false;
  }

  const existing = await db.pushSubscription.findUnique({
    where: { endpoint },
    select: { id: true },
  });

  return Boolean(existing);
}
