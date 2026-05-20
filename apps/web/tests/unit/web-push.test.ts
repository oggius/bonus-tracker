import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const setVapidDetailsMock = vi.fn();
const sendNotificationMock = vi.fn();
const findManyMock = vi.fn();
const deleteMock = vi.fn();

vi.mock("web-push", () => ({
  default: {
    setVapidDetails: setVapidDetailsMock,
    sendNotification: sendNotificationMock,
  },
}));

vi.mock("../../lib/db", () => ({
  db: {
    pushSubscription: {
      findMany: findManyMock,
      delete: deleteMock,
    },
  },
}));

async function importFreshSendPushToAdmins() {
  vi.resetModules();
  const mod = await import("../../lib/web-push");
  return mod.sendPushToAdmins;
}

const originalEnv = { ...process.env };

beforeEach(() => {
  setVapidDetailsMock.mockReset();
  sendNotificationMock.mockReset();
  findManyMock.mockReset();
  deleteMock.mockReset();
  delete process.env.VAPID_PUBLIC_KEY;
  delete process.env.VAPID_PRIVATE_KEY;
  delete process.env.VAPID_SUBJECT;
});

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("sendPushToAdmins", () => {
  it("is a no-op when VAPID env vars are unset", async () => {
    const sendPushToAdmins = await importFreshSendPushToAdmins();

    await sendPushToAdmins({ title: "t", body: "b" });

    expect(findManyMock).not.toHaveBeenCalled();
    expect(sendNotificationMock).not.toHaveBeenCalled();
    expect(setVapidDetailsMock).not.toHaveBeenCalled();
  });

  it("queries subscriptions scoped to admin users only", async () => {
    process.env.VAPID_PUBLIC_KEY = "pk";
    process.env.VAPID_PRIVATE_KEY = "sk";
    process.env.VAPID_SUBJECT = "mailto:admin@example.com";
    findManyMock.mockResolvedValue([]);

    const sendPushToAdmins = await importFreshSendPushToAdmins();

    await sendPushToAdmins({ title: "t", body: "b" });

    expect(setVapidDetailsMock).toHaveBeenCalledWith(
      "mailto:admin@example.com",
      "pk",
      "sk"
    );
    expect(findManyMock).toHaveBeenCalledTimes(1);
    expect(findManyMock.mock.calls[0][0]).toMatchObject({
      where: { user: { role: "ADMIN" } },
    });
  });

  it("sends a notification per subscription with stringified payload", async () => {
    process.env.VAPID_PUBLIC_KEY = "pk";
    process.env.VAPID_PRIVATE_KEY = "sk";
    process.env.VAPID_SUBJECT = "mailto:admin@example.com";
    findManyMock.mockResolvedValue([
      { id: "sub-1", endpoint: "https://push/1", p256dh: "p1", auth: "a1" },
      { id: "sub-2", endpoint: "https://push/2", p256dh: "p2", auth: "a2" },
    ]);
    sendNotificationMock.mockResolvedValue(undefined);

    const sendPushToAdmins = await importFreshSendPushToAdmins();

    await sendPushToAdmins({ title: "Title", body: "Body", url: "/admin/points" });

    expect(sendNotificationMock).toHaveBeenCalledTimes(2);
    const [firstSub, firstPayload] = sendNotificationMock.mock.calls[0];
    expect(firstSub).toEqual({
      endpoint: "https://push/1",
      keys: { p256dh: "p1", auth: "a1" },
    });
    expect(JSON.parse(firstPayload)).toEqual({
      title: "Title",
      body: "Body",
      url: "/admin/points",
    });
  });

  it("deletes the subscription when the push service returns 410 (gone)", async () => {
    process.env.VAPID_PUBLIC_KEY = "pk";
    process.env.VAPID_PRIVATE_KEY = "sk";
    process.env.VAPID_SUBJECT = "mailto:admin@example.com";
    findManyMock.mockResolvedValue([
      { id: "sub-stale", endpoint: "https://push/stale", p256dh: "p", auth: "a" },
    ]);
    sendNotificationMock.mockRejectedValue(
      Object.assign(new Error("Gone"), { statusCode: 410 })
    );
    deleteMock.mockResolvedValue(undefined);

    const sendPushToAdmins = await importFreshSendPushToAdmins();

    await sendPushToAdmins({ title: "t", body: "b" });

    expect(deleteMock).toHaveBeenCalledWith({ where: { id: "sub-stale" } });
  });

  it("does NOT delete the subscription on transient errors", async () => {
    process.env.VAPID_PUBLIC_KEY = "pk";
    process.env.VAPID_PRIVATE_KEY = "sk";
    process.env.VAPID_SUBJECT = "mailto:admin@example.com";
    findManyMock.mockResolvedValue([
      { id: "sub-1", endpoint: "https://push/1", p256dh: "p", auth: "a" },
    ]);
    sendNotificationMock.mockRejectedValue(
      Object.assign(new Error("Server error"), { statusCode: 500 })
    );

    const sendPushToAdmins = await importFreshSendPushToAdmins();

    await sendPushToAdmins({ title: "t", body: "b" });

    expect(deleteMock).not.toHaveBeenCalled();
  });
});
