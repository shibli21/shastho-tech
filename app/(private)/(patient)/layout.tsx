import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/shared";
import { PatientLayoutClient } from "./_components/patient-layout-client";

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    redirect("/sign-in");
  }

  // Redirect if user should be on a different dashboard
  const correctPath = getDashboardPath(session);
  if (correctPath.startsWith("/admin") || correctPath.startsWith("/lab")) {
    redirect(correctPath);
  }

  return <PatientLayoutClient user={session.user}>{children}</PatientLayoutClient>;
}
