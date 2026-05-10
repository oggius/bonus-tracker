import Link from "next/link";
import { Activity, Plus } from "lucide-react";

import { Button, Card } from "@bonus-tracker/ui";

import { requireAdminUser } from "../../../../lib/auth";
import { getActivitiesForAdmin } from "../../../actions/activities";
import { ActivityReorderList } from "./activity-reorder-list";

export default async function AdminActivitiesPage() {
  await requireAdminUser();

  const activities = await getActivitiesForAdmin();

  return (
    <section className="space-y-6">
      <Card className="rounded-[30px] border border-gray-200 bg-white px-6 py-8 shadow-lg">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-amber-50 p-3">
            <Activity className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-4xl font-semibold text-gray-900">Управління активностями</h2>
          <p className="mt-2 text-lg text-gray-600">Створюйте шаблони активностей та керуйте їхнім порядком.</p>
        </div>
      </Card>

      <Card className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-2xl font-semibold text-gray-900">Список активностей</h3>
          <Link href="/admin/activities/create">
            <Button className="gap-2" data-testid="create-activity-link">
              <Plus className="h-4 w-4" />
              Нова активність
            </Button>
          </Link>
        </div>

        {activities.length ? (
          <ActivityReorderList activities={activities} />
        ) : (
          <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
            Поки що активностей немає. Створіть першу активність.
          </p>
        )}
      </Card>

      <div>
        <Link href="/admin">
          <Button variant="outline">Назад до панелі</Button>
        </Link>
      </div>
    </section>
  );
}
