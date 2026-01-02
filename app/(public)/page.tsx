import React from "react";
import { getPublicTests, getPublicPackages } from "@/app/actions/public";
import { getUserOrders } from "@/app/actions/orders";
import LandingPageClient from "./_components/landing-page-client";

export default async function Page() {
  const tests = await getPublicTests();
  const packages = await getPublicPackages();
  const orders = await getUserOrders();

  return <LandingPageClient initialTests={tests} initialPackages={packages} initialOrders={orders} />;
}
