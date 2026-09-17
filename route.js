const { NextResponse } = require("next/server");
const { verifyOtp } = require("../../../../lib/auth");

async function POST(req) {
  const { contact, code } = await req.json();

  if (!contact || !code) {
    return NextResponse.json({ error: "Contact and code are required" }, { status: 400 });
  }

  const result = await verifyOtp(contact, code);

  if (!result) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
  }

  const response = NextResponse.json({ user: result.user });
  response.cookies.set("session_token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return response;
}

module.exports = { POST };
