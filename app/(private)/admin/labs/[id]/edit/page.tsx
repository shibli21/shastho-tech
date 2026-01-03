import { notFound } from "next/navigation";
import { getLab } from "@/app/actions/admin";
import { EditLabForm } from "./EditLabForm";

interface EditLabPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLabPage({ params }: EditLabPageProps) {
  const { id } = await params;
  const lab = await getLab(id);

  if (!lab) {
    notFound();
  }

  return <EditLabForm lab={lab} />;
}
