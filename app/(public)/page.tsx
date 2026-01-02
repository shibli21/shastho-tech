import React from "react";
import { getPublicTests, getPublicPackages } from "@/app/actions/public";
import LandingPageClient from "./_components/landing-page-client";

export default async function Page() {
  const tests = await getPublicTests();
  const packages = await getPublicPackages();

  return <LandingPageClient initialTests={tests} initialPackages={packages} />;
}
