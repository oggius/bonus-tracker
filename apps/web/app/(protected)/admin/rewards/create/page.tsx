import Link from "next/link";
import { redirect } from "next/navigation";

import { Button, Card } from "@bonus-tracker/ui";
import { getCurrentUser } from "../../../../../lib/auth";
import { createRewardAction } from "../../../../actions/rewards";
import { RewardForm } from "../reward-form";

export default async function CreateRewardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/");
  }

  if (currentUser.role !== "ADMIN") {
    redirect("/user");
  }

  return (
    <section className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Додати нову нагороду</h2>
      </div>

      <Card className="p-6">
        <RewardForm action={createRewardAction} />
      </Card>

      <Link href="/admin/rewards">
        <Button variant="outline">Скасувати</Button>
      </Link>
    </section>
  );
}
