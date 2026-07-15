import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwtPayload(token: string): any | null {
  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return null;
    
    let base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (req.nextUrl.pathname.startsWith("/blog/write")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const payload = decodeJwtPayload(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/write"],
};
