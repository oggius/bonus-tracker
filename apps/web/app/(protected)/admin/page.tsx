import Link from "next/link";
import { Gift, ListChecks, Plus, ShieldCheck } from "lucide-react";

import { requireAdminUser } from "../../../lib/auth";
import { Button, Card } from "@bonus-tracker/ui";

export default async function AdminPage() {
  await requireAdminUser();

  return (
    <section className="space-y-6">
      <Card className="rounded-[30px] border border-gray-200 bg-white px-6 py-8 shadow-lg">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-blue-50 p-3">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-4xl font-semibold text-gray-900">Адмін-панель</h2>
          <p className="mt-2 text-lg text-gray-600">Керування нагородами, очками та налаштуваннями.</p>
        </div>
      </Card>

      <div className="grid gap-4">
        <Card className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">
                <Gift className="h-4 w-4" />
                Нагороди
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Управління нагородами</h3>
              <p className="text-gray-600">Керуйте доступними нагородами та їх вартістю в очках.</p>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Link href="/admin/rewards/create">
              <Button
                data-testid="create-reward-button"
                className="gap-2 text-white"
                style={{ backgroundImage: "linear-gradient(90deg, #facc15 0%, #fb923c 100%)" }}
              >
                <Plus className="h-4 w-4" />
                Додати нагороду
              </Button>
            </Link>
            <Link href="/admin/rewards">
              <Button variant="outline">До списку</Button>
            </Link>
          </div>
        </Card>

        <Card className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
              <ListChecks className="h-4 w-4" />
              Операції
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">Управління очками</h3>
            <p className="text-gray-600">Нараховуйте або списуйте очки з серверною валідацією та історією.</p>
          </div>

          <div className="mt-4">
            <Link href="/admin/points">
              <Button variant="outline" data-testid="manage-points-button">Керувати очками</Button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
