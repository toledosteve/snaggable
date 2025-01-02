import { handleRegistrationMiddleware } from "@/lib/middleware/registration";
import { NextResponse } from "next/server";

export async function middleware(req: Request) {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/registration")) {
    return handleRegistrationMiddleware(req);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/registration/:path*",
  ],
};
