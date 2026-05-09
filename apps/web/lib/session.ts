import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { Role } from "@bonus-tracker/db";

export const SESSION_COOKIE_NAME = "bonus_tracker_session";
const SESSION_EXPIRATION = "365d";

export type SessionPayload = JWTPayload & {
  sub: string;
  role: Role;
  name: string;
};

function getSessionKey() {
  const secret = process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === "production" && !secret) {
    throw new Error("SESSION_SECRET must be set in production");
  }

  const resolvedSecret = secret ?? "dev-only-session-secret-change-me";
  return new TextEncoder().encode(resolvedSecret);
}

export async function signSessionToken(payload: {
  userId: string;
  role: Role;
  name: string;
}) {
  return new SignJWT({
    role: payload.role,
    name: payload.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRATION)
    .sign(getSessionKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionKey());
    if (!payload.sub || !payload.role || !payload.name) {
      return null;
    }
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
