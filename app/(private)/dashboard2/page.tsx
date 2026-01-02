import { redirect } from "next/navigation";

// Redirect from /dashboard to the patient dashboard
export default function DashboardRedirectPage() {
  redirect("/dashboard");
}
