export type PushSubscriptionInput = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export function parsePushSubscription(raw: unknown): PushSubscriptionInput {
  if (!raw || typeof raw !== "object") {
    throw new Error("Невірний формат підписки");
  }

  const sub = raw as Partial<PushSubscriptionInput>;
  const endpoint = typeof sub.endpoint === "string" ? sub.endpoint.trim() : "";
  const p256dh = typeof sub.keys?.p256dh === "string" ? sub.keys.p256dh : "";
  const auth = typeof sub.keys?.auth === "string" ? sub.keys.auth : "";

  if (!endpoint || !p256dh || !auth) {
    throw new Error("Невірний формат підписки");
  }

  return { endpoint, keys: { p256dh, auth } };
}
