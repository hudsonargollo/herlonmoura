import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/api/crm", "/blog", "/sitemap.xml"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public API and blog paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Admin routes: check auth cookie
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    // TODO: verify JWT signature
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};