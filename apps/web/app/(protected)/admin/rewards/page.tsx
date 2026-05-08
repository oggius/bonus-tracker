import Link from "next/link";
import { redirect } from "next/navigation";
import { Gift, Plus, Settings } from "lucide-react";

import { getCurrentUser } from "../../../../lib/auth";
import { db } from "../../../../lib/db";
import { Button } from "@bonus-tracker/ui";
import { Card } from "@bonus-tracker/ui";
import { Badge } from "@bonus-tracker/ui";
import { DeactivateRewardButton } from "./deactivate-reward-button";

export default async function RewardsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/");
  }

  if (currentUser.role !== "ADMIN") {
    redirect("/user");
  }

  const rewards = await db.rewardDefinition.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-6">
      <Card className="rounded-[30px] border border-gray-200 bg-white px-6 py-8 shadow-lg">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-amber-50 p-3">
            <Gift className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-4xl font-semibold text-gray-900">Нагороди</h2>
          <p className="mt-2 text-lg text-gray-600">Конфігуруйте каталог нагород і їх вартість.</p>
        </div>

        <div className="mt-6 flex justify-center gap-3">
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
          <Link href="/admin">
            <Button variant="outline">До панелі</Button>
          </Link>
        </div>
      </Card>

      {rewards.length === 0 ? (
        <Card className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-gray-500">
            Нагород ще не додано. Почніть з першої нагороди!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {rewards.map((reward) => (
            <Card
              key={reward.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              data-testid={`reward-item-${reward.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-semibold text-gray-900">{reward.name}</h3>
                    <Badge variant={reward.active ? "default" : "secondary"}>
                      {reward.active ? "Активна" : "Неактивна"}
                    </Badge>
                  </div>
                  {reward.description && (
                    <p className="text-sm text-gray-500">
                      {reward.description}
                    </p>
                  )}
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-lg font-semibold text-blue-700">
                    <Settings className="h-4 w-4" />
                    {reward.cost} очок
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/rewards/${reward.id}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`edit-reward-button-${reward.id}`}
                    >
                      Редагувати
                    </Button>
                  </Link>
                  {reward.active && (
                    <DeactivateRewardButton rewardId={reward.id} />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
