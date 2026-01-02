import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Routes that require authentication
const protectedPatterns = [
	/^\/dashboard/,
	/^\/orders/,
	/^\/reports/,
	/^\/family/,
	/^\/profile/,
	/^\/cart/,
	/^\/admin/,
	/^\/lab/,
];

// Routes only for guests (auth routes)
const authRoutes = ["/sign-in", "/forget-password", "/reset-password"];

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check for session cookie
	const sessionCookie = getSessionCookie(request);
	const isAuthenticated = !!sessionCookie;

	// Protected routes - redirect to sign-in if not authenticated
	const isProtectedRoute = protectedPatterns.some((pattern) =>
		pattern.test(pathname)
	);

	if (isProtectedRoute && !isAuthenticated) {
		const signInUrl = new URL("/sign-in", request.url);
		signInUrl.searchParams.set("callbackUrl", pathname);
		return NextResponse.redirect(signInUrl);
	}

	// Auth routes - redirect to dashboard if already authenticated
	// Note: Full role-based redirect happens server-side in layouts
	if (
		authRoutes.some((route) => pathname.startsWith(route)) &&
		isAuthenticated
	) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
