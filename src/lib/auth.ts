import { cookies } from "next/headers";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";

const sessionCookie = "propchain_session";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) {
    return false;
  }

  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function createSessionToken(userId: string) {
  return createHash("sha256").update(`${userId}:${process.env.OPENAI_API_KEY ?? "dev"}`).digest("hex");
}

export function setSession(userId: string) {
  cookies().set(sessionCookie, `${userId}.${createSessionToken(userId)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function getSessionUserId() {
  const value = cookies().get(sessionCookie)?.value;
  if (!value) {
    return null;
  }

  const [userId, token] = value.split(".");
  if (!userId || !token || token !== createSessionToken(userId)) {
    return null;
  }

  return userId;
}
