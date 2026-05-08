import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PencilLine } from "lucide-react";

import { Button, Card } from "@bonus-tracker/ui";
import { getCurrentUser } from "../../../../../../lib/auth";
import { db } from "../../../../../../lib/db";
import { updateRewardAction } from "../../../../../actions/rewards";
import { RewardForm } from "../../reward-form";

export default async function EditRewardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/");
  }

  if (currentUser.role !== "ADMIN") {
    redirect("/user");
  }

  const { id } = await params;

  const reward = await db.rewardDefinition.findUnique({
    where: { id },
  });

  if (!reward) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-6">
      <Card className="rounded-[30px] border border-gray-200 bg-white px-6 py-8 shadow-lg">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-blue-50 p-3">
            <PencilLine className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-4xl font-semibold text-gray-900">Редагувати нагороду</h2>
          <p className="mt-2 text-lg text-gray-600">Оновіть назву, вартість або опис нагороди.</p>
        </div>
      </Card>

      <Card className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <RewardForm
          action={updateRewardAction}
          initialData={{
            id: reward.id,
            name: reward.name,
            cost: reward.cost,
            description: reward.description ?? "",
          }}
          submitLabel="Оновити нагороду"
        />
      </Card>

      <Link href="/admin/rewards">
        <Button variant="outline">Скасувати</Button>
      </Link>
    </section>
  );
}
