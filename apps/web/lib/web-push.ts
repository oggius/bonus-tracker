import "server-only";

import webpush from "web-push";

import { db } from "./db";

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

type VapidConfig = {
  publicKey: string;
  privateKey: string;
  subject: string;
};

let vapidConfig: VapidConfig | null | undefined;

function getVapidConfig(): VapidConfig | null {
  if (vapidConfig !== undefined) {
    return vapidConfig;
  }

  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    console.warn(
      "[web-push] VAPID env vars are not configured; push notifications are disabled."
    );
    vapidConfig = null;
    return vapidConfig;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  vapidConfig = { publicKey, privateKey, subject };
  return vapidConfig;
}

export async function sendPushToAdmins(payload: PushPayload): Promise<void> {
  const config = getVapidConfig();
  if (!config) {
    return;
  }

  const subscriptions = await db.pushSubscription.findMany({
    where: { user: { role: "ADMIN" } },
    select: {
      id: true,
      endpoint: true,
      p256dh: true,
      auth: true,
    },
  });

  if (subscriptions.length === 0) {
    return;
  }

  const body = JSON.stringify(payload);

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          body
        );
      } catch (error) {
        const statusCode = (error as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await db.pushSubscription
            .delete({ where: { id: subscription.id } })
            .catch(() => undefined);
          return;
        }
        console.error("[web-push] sendNotification failed", error);
      }
    })
  );
}
