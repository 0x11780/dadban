import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSideAppOrigin } from "@/lib/app-base-url";
import { daadnegar_INVITE_TOKEN_COOKIE } from "@/lib/edyen";

export const config = {
  matcher: ["/admin", "/admin/:path*", "/panel", "/panel/:path*"],
};

function getInviteTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|; )${daadnegar_INVITE_TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  /** Same-process fetch; avoid https public origin inside the pod (TLS vs HTTP mismatch). */
  const internalOrigin = getServerSideAppOrigin();
  const baseUrl = request.nextUrl.origin;

  // --- Panel routes: require user auth, redirect to home if not logged in ---
  if (pathname.startsWith("/panel")) {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const inviteToken = getInviteTokenFromCookie(cookieHeader);

    const headers: HeadersInit = {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    };
    if (inviteToken) {
      headers["Authorization"] = `Bearer ${inviteToken}`;
    }

    const res = await fetch(new URL("/api/me", internalOrigin), {
      headers,
      cache: "no-store",
    });

    if (res.status === 401 || !res.ok) {
      return NextResponse.redirect(new URL("/", baseUrl));
    }

    return NextResponse.next();
  }

  // --- Admin routes ---
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const res = await fetch(new URL("/api/admin/me", internalOrigin), {
    headers: {
      Cookie: request.headers.get("cookie") ?? "",
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    const loginUrl = new URL("/admin/login", baseUrl);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
