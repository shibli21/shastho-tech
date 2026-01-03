import { getTestCategories } from "@/app/actions/admin";
import { NewTestForm } from "./_components/new-test-form";

export default async function NewTestPage() {
  const categories = await getTestCategories();

  return <NewTestForm categories={categories} />;
}
