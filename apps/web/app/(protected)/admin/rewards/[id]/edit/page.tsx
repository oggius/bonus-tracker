import Link from "next/link";
import { notFound, redirect } from "next/navigation";

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
    <section className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Редагувати нагороду</h2>
      </div>

      <Card className="p-6">
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
