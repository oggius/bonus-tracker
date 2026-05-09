import Link from "next/link";
import { Gift, Plus } from "lucide-react";

import { Button, Card } from "@bonus-tracker/ui";
import { requireAdminUser } from "../../../../../lib/auth";
import { createRewardAction } from "../../../../actions/rewards";
import { RewardForm } from "../reward-form";

export default async function CreateRewardPage() {
  await requireAdminUser();

  return (
    <section className="mx-auto w-full max-w-2xl space-y-6">
      <Card className="rounded-[30px] border border-gray-200 bg-white px-6 py-8 shadow-lg">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-amber-50 p-3">
            <Plus className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-4xl font-semibold text-gray-900">Додати нагороду</h2>
          <p className="mt-2 text-lg text-gray-600">Створіть нову винагороду для каталогу.</p>
        </div>
      </Card>

      <Card className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <RewardForm action={createRewardAction} />
      </Card>

      <div className="flex gap-3">
        <Link href="/admin/rewards">
          <Button variant="outline">Скасувати</Button>
        </Link>
        <Link href="/admin/rewards">
          <Button variant="ghost" className="gap-2 text-gray-600">
            <Gift className="h-4 w-4" />
            До нагород
          </Button>
        </Link>
      </div>
    </section>
  );
}
