import argon2 from "argon2";

// Argon2id is the OWASP-recommended variant: resistant to both
// GPU cracking and side-channel attacks.
const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19456, // ~19 MB
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain, ARGON2_OPTIONS);
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    // Malformed hash or verification error — treat as invalid, never throw
    // out to the caller (avoids leaking timing/error details).
    return false;
  }
}
