import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminLayoutClient } from "./_components/admin-layout-client";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    redirect("/sign-in");
  }

  // Only allow admins
  if (session.user.role !== "admin") {
    redirect("/dashboard"); // Send non-admins to patient dashboard
  }

  return <AdminLayoutClient user={session.user}>{children}</AdminLayoutClient>;
}
