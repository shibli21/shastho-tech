import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { parseOrgMetadata } from "@/lib/shared";
import { LabLayoutClient } from "./_components/lab-layout-client";

export default async function LabLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    redirect("/sign-in");
  }

  // Verify user belongs to a lab organization
  const activeOrg = session.activeOrganization;
  const metadata = activeOrg ? parseOrgMetadata(activeOrg.metadata) : null;

  if (!metadata || metadata.type !== "lab") {
    redirect("/dashboard"); // Not a lab partner
  }

  return (
    <LabLayoutClient user={session.user} organizationName={activeOrg?.name}>
      {children}
    </LabLayoutClient>
  );
}
