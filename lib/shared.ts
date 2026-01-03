import type { ReadonlyURLSearchParams } from "next/navigation";
import type { Session } from "./auth";

export type UserRole = "patient" | "admin";
export type OrgType = "lab";

export interface LabMetadata {
	type: "lab";
	status: "pending" | "active" | "suspended";
	accreditations: string[];
	serviceAreas: string[];
	contactPhone: string;
	contactEmail: string;
	rating: number | null;
	logoUrl: string | null;
}

/**
 * Parse organization metadata safely
 */
export function parseOrgMetadata(
	metadata: string | Record<string, unknown> | null | undefined
): LabMetadata | null {
	if (!metadata) return null;

	try {
		const parsed =
			typeof metadata === "string" ? JSON.parse(metadata) : metadata;
		if (parsed?.type === "lab") {
			return parsed as LabMetadata;
		}
		return null;
	} catch {
		return null;
	}
}

/**
 * Determine the correct dashboard path based on user role and organization membership
 */
export function getDashboardPath(session: Session | null): string {
	if (!session) return "/sign-in";

	const { user } = session;

	// Platform admin - highest priority
	if (user.role === "admin") {
		return "/admin/dashboard";
	}

	// Lab partner - check if user belongs to a lab organization
	// activeOrganization is added by organization plugin but not in base Session type
	const activeOrg = (session as unknown as { activeOrganization?: { metadata?: string | Record<string, unknown> } }).activeOrganization;
	if (activeOrg) {
		const metadata = parseOrgMetadata(activeOrg.metadata);
		if (metadata?.type === "lab") {
			return "/lab/dashboard";
		}
	}

	// Default: patient dashboard
	return "/dashboard";
}

/**
 * Check if user is a platform admin
 */
export function isAdmin(session: Session | null): boolean {
	return session?.user?.role === "admin";
}

/**
 * Check if user is a lab partner
 */
export function isLabPartner(session: Session | null): boolean {
	if (!session) return false;
	const sessionWithOrg = session as unknown as { activeOrganization?: { metadata?: string | Record<string, unknown> } };
	if (!sessionWithOrg.activeOrganization) return false;
	const metadata = parseOrgMetadata(sessionWithOrg.activeOrganization.metadata);
	return metadata?.type === "lab";
}

/**
 * Check if user is a regular patient
 */
export function isPatient(session: Session | null): boolean {
	if (!session) return false;
	return !isAdmin(session) && !isLabPartner(session);
}

// Allowed callback URLs for post-login redirect
const allowedCallbackSet: ReadonlySet<string> = new Set([
	"/dashboard",
	"/admin/dashboard",
	"/lab/dashboard",
	"/device",
	"/orders",
	"/reports",
	"/profile",
	"/cart",
]);

/**
 * Get the callback URL from query params, with validation and fallback to role-based dashboard
 */
export const getCallbackURL = (
	queryParams: ReadonlyURLSearchParams,
	session?: Session | null
): string => {
	const callbackUrl = queryParams.get("callbackUrl");

	// If callback URL is provided and allowed, use it
	if (callbackUrl && allowedCallbackSet.has(callbackUrl)) {
		return callbackUrl;
	}

	// Otherwise, redirect to role-based dashboard
	return session ? getDashboardPath(session) : "/dashboard";
};
