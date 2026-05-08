import Link from "next/link";
import { redirect } from "next/navigation";

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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Нагороди</h2>
        <Link href="/admin/rewards/create">
          <Button data-testid="create-reward-button">Додати нагороду</Button>
        </Link>
      </div>

      {rewards.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            Нагород ще не додано. Почніть з першої нагороди!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {rewards.map((reward) => (
            <Card key={reward.id} className="p-4" data-testid={`reward-item-${reward.id}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{reward.name}</h3>
                    <Badge variant={reward.active ? "default" : "secondary"}>
                      {reward.active ? "Активна" : "Неактивна"}
                    </Badge>
                  </div>
                  {reward.description && (
                    <p className="text-sm text-muted-foreground">
                      {reward.description}
                    </p>
                  )}
                  <div className="text-2xl font-bold text-primary">
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
