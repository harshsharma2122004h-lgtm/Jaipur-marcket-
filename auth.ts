import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { prisma } from "./prisma";

const SESSION_COOKIE = "jm_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET env var must be set to a random string of at least 32 characters."
    );
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  sid: string; // Session row id (DB) — lets us revoke server-side
  uid: string; // User id
  role: string;
}

// Create a DB-backed session row + a signed JWT that references it.
// Storing the session server-side (not just a stateless JWT) is what
// makes "log out everywhere" / revocation possible.
export async function createSession(userId: string, role: string, meta: {
  userAgent?: string;
  ipAddress?: string;
}): Promise<string> {
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  const session = await prisma.session.create({
    data: {
      userId,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
      expiresAt,
    },
  });

  const token = await new SignJWT({ sid: session.id, uid: userId, role } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .setJti(nanoid())
    .sign(getSecret());

  return token;
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

// Verifies the JWT signature/expiry AND checks the DB row hasn't been
// revoked. Both checks matter: the JWT alone can't express "log this
// session out right now".
export async function getCurrentSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const data = payload as unknown as SessionPayload;

    const dbSession = await prisma.session.findUnique({ where: { id: data.sid } });
    if (!dbSession || dbSession.revokedAt || dbSession.expiresAt < new Date()) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export async function revokeSession(sessionId: string) {
  await prisma.session.update({
    where: { id: sessionId },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllUserSessions(userId: string) {
  await prisma.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
