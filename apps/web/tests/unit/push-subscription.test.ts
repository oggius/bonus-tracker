import { describe, expect, it } from "vitest";

import { parsePushSubscription } from "../../lib/push-subscription";

const validSubscription = {
  endpoint: "https://fcm.googleapis.com/wp/example",
  keys: {
    p256dh: "BNc...key",
    auth: "abc123",
  },
};

describe("parsePushSubscription", () => {
  it("returns a normalized subscription for valid input", () => {
    const result = parsePushSubscription(validSubscription);
    expect(result).toEqual(validSubscription);
  });

  it("trims surrounding whitespace from the endpoint", () => {
    const result = parsePushSubscription({
      ...validSubscription,
      endpoint: "  https://fcm.googleapis.com/wp/example  ",
    });
    expect(result.endpoint).toBe("https://fcm.googleapis.com/wp/example");
  });

  it.each([null, undefined, "string", 42, true])(
    "rejects non-object input (%s)",
    (value) => {
      expect(() => parsePushSubscription(value)).toThrow(/Невірний формат підписки/);
    }
  );

  it("rejects when endpoint is missing", () => {
    expect(() =>
      parsePushSubscription({
        keys: validSubscription.keys,
      })
    ).toThrow(/Невірний формат підписки/);
  });

  it("rejects when endpoint is an empty string", () => {
    expect(() =>
      parsePushSubscription({
        ...validSubscription,
        endpoint: "   ",
      })
    ).toThrow(/Невірний формат підписки/);
  });

  it("rejects when keys.p256dh is missing", () => {
    expect(() =>
      parsePushSubscription({
        endpoint: validSubscription.endpoint,
        keys: { auth: "abc" },
      })
    ).toThrow(/Невірний формат підписки/);
  });

  it("rejects when keys.auth is missing", () => {
    expect(() =>
      parsePushSubscription({
        endpoint: validSubscription.endpoint,
        keys: { p256dh: "BNc" },
      })
    ).toThrow(/Невірний формат підписки/);
  });

  it("rejects when keys field is the wrong type", () => {
    expect(() =>
      parsePushSubscription({
        endpoint: validSubscription.endpoint,
        keys: "not-an-object",
      })
    ).toThrow(/Невірний формат підписки/);
  });
});
