import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "clai_session";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isCandidate = path.startsWith("/candidate") && !path.startsWith("/candidate/login");
  const isAdmin = path.startsWith("/admin");

  if (!isCandidate && !isAdmin) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/candidate/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/candidate/:path*", "/admin/:path*"],
};
