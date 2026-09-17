const jwt = require("jsonwebtoken");
const { db } = require("./db");

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
const OTP_EXPIRY_MINUTES = 10;

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

// Creates and "sends" an OTP. Replace the console.log with a real SMS/email
// provider (e.g. MSG91, Twilio, Resend) when ready — this keeps Phase 1
// runnable without any paid SMS account.
async function sendOtp(contact) {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await db.otpCode.create({
    data: { contact, code, expiresAt },
  });

  console.log(`[DEV ONLY] OTP for ${contact}: ${code}`);
  // TODO: integrate real SMS/email sender here
  return true;
}

async function verifyOtp(contact, code) {
  const record = await db.otpCode.findFirst({
    where: { contact, code, used: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return null;

  await db.otpCode.update({ where: { id: record.id }, data: { used: true } });

  let user = await db.user.findFirst({
    where: contact.includes("@") ? { email: contact } : { phone: contact },
  });

  if (!user) {
    user = await db.user.create({
      data: contact.includes("@") ? { email: contact } : { phone: contact },
    });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "30d",
  });

  return { user, token };
}

function verifySessionToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = { sendOtp, verifyOtp, verifySessionToken };
