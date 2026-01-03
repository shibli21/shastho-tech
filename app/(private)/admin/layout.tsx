import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminLayoutClient } from "./_components/admin-layout-client";

// Must match adminUserIds in lib/auth.ts
const ADMIN_USER_IDS = ["CvzpWCiEZzYkiZLBFCwbrTUBQodJxpX7"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    redirect("/sign-in");
  }

  // Only allow admins by checking against adminUserIds
  if (!ADMIN_USER_IDS.includes(session.user.id)) {
    redirect("/dashboard"); // Send non-admins to patient dashboard
  }

  return <AdminLayoutClient user={session.user}>{children}</AdminLayoutClient>;
}
