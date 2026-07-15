import crypto from "crypto";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "jarvis-secure-core-secret-key-13579";

// 1. Password Hashing (Compile-safe native crypto PBKDF2)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === testHash;
}

// 2. JWT Signature & Verification (Zero external dependencies)
export function signToken(payload: any): string {
  const header = { alg: "HS256", typ: "JWT" };
  const base64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${base64Header}.${base64Payload}`)
    .digest("base64url");
    
  return `${base64Header}.${base64Payload}.${signature}`;
}

export function verifyToken(token: string): any | null {
  try {
    const [base64Header, base64Payload, signature] = token.split(".");
    const computedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${base64Header}.${base64Payload}`)
      .digest("base64url");
      
    if (signature !== computedSignature) return null;
    
    return JSON.parse(Buffer.from(base64Payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

// 3. Helper to read user session in API route handlers
export function getSessionUser(req: NextRequest): any | null {
  const cookie = req.cookies.get("auth_token")?.value;
  if (!cookie) return null;
  return verifyToken(cookie);
}
