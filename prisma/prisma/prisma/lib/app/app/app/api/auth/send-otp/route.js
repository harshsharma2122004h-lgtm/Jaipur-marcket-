const { NextResponse } = require("next/server");
const { sendOtp } = require("../../../../lib/auth");

async function POST(req) {
  const { contact } = await req.json();

  if (!contact) {
    return NextResponse.json({ error: "Phone or email is required" }, { status: 400 });
  }

  await sendOtp(contact);
  return NextResponse.json({ message: "OTP sent" });
}

module.exports = { POST };
