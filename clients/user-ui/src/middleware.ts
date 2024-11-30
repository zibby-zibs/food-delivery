// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./utils/verifyToken";

// List of routes that do not require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/register-restaurant",
  "/public",
  "/api/auth/login",
  "/api/auth/register",
  "/",
];

// Routes that start with these paths will be public
const PUBLIC_PATH_PREFIXES = ["/public", "/about", "/contact", "/api/public"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if the route is explicitly public
  const isPublicRoute = PUBLIC_ROUTES.includes(path);

  // Check if the route starts with any public path prefix
  const isPublicPathPrefix = PUBLIC_PATH_PREFIXES.some((prefix) =>
    path.startsWith(prefix)
  );

  // If it's a public route, continue without authentication
  if (isPublicRoute || isPublicPathPrefix) {
    return NextResponse.next();
  }

  // Check for authentication token
  const token = req.cookies.get("access_token")?.value;

  // If no token exists, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    // Verify the token
    const decoded = await verifyToken(token);

    // If token is valid, continue the request
    const response = NextResponse.next();

    // Optionally, you can attach user info to the request
    response.headers.set("x-user-id", decoded?.id);

    return response;
  } catch (error) {
    // Token is invalid, redirect to login
    console.log(error);
    console.log("Token is invalid", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    // Apply middleware to all routes except static files and API routes
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
