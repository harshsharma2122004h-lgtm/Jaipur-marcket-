import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/lib/validation";
import { createSession, setSessionCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  // Rate-limit by IP AND by email to blunt both distributed and
  // single-account brute-force attempts.
  const { allowed } = checkRateLimit(`login:${ip}`, 10, 60 * 15);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const emailLimit = checkRateLimit(`login-email:${email}`, 10, 60 * 15);
  if (!emailLimit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always run a hash comparison even when the user doesn't exist, using
  // a dummy hash. This keeps response timing similar for "no such user"
  // vs "wrong password" so an attacker can't enumerate valid emails.
  const DUMMY_HASH =
    "$argon2id$v=19$m=19456,t=2,p=1$c29tZXNhbHQ$Q0FsbHRoaXNpc2p1c3RhcGxhY2Vob2xkZXI";
  const valid = await verifyPassword(user?.passwordHash ?? DUMMY_HASH, password);

  if (!user || !valid || !user.isActive) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await createSession(user.id, user.role, {
    userAgent: req.headers.get("user-agent") ?? undefined,
    ipAddress: ip,
  });
  await setSessionCookie(token);

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}
