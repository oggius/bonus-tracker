import Link from "next/link";
import { notFound } from "next/navigation";
import { PencilLine } from "lucide-react";

import { Button, Card } from "@bonus-tracker/ui";

import { requireAdminUser } from "../../../../../../lib/auth";
import { db } from "../../../../../../lib/db";
import { updateActivityAction } from "../../../../../actions/activities";
import { ActivityForm } from "../../activity-form";

export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminUser();

  const { id } = await params;

  const activity = await db.activity.findUnique({
    where: { id },
  });

  if (!activity) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-6">
      <Card className="rounded-[30px] border border-gray-200 bg-white px-6 py-8 shadow-lg">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-blue-50 p-3">
            <PencilLine className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-4xl font-semibold text-gray-900">Редагувати активність</h2>
          <p className="mt-2 text-lg text-gray-600">Оновіть опис або кількість очок для активності.</p>
        </div>
      </Card>

      <Card className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <ActivityForm
          action={updateActivityAction}
          initialData={{
            id: activity.id,
            description: activity.description,
            points: activity.points,
          }}
          submitLabel="Оновити активність"
        />
      </Card>

      <Link href="/admin/activities">
        <Button variant="outline">Скасувати</Button>
      </Link>
    </section>
  );
}
