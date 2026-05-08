import { describe, expect, it } from "vitest";

import { signSessionToken, verifySessionToken } from "../../lib/session";

describe("session token", () => {
  it("signs and verifies a valid payload", async () => {
    process.env.SESSION_SECRET = "test-secret";

    const token = await signSessionToken({
      userId: "seed-admin",
      role: "ADMIN",
      name: "Тато",
    });

    const payload = await verifySessionToken(token);

    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe("seed-admin");
    expect(payload?.role).toBe("ADMIN");
    expect(payload?.name).toBe("Тато");
  });

  it("returns null for invalid token", async () => {
    process.env.SESSION_SECRET = "test-secret";

    const payload = await verifySessionToken("not-a-jwt");

    expect(payload).toBeNull();
  });
});
