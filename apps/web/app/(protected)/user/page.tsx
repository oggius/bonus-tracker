import { redirect } from "next/navigation";

import { getCurrentUser } from "../../../lib/auth";
import { db } from "../../../lib/db";
import { getUserBalance, getUserHistory } from "../../../lib/balance";
import { ExchangeSections } from "./exchange-sections";

export default async function UserPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/");
  }

  if (currentUser.role !== "USER") {
    redirect("/admin");
  }

  const [balance, history, rewards, exchanges] = await Promise.all([
    getUserBalance(currentUser.id),
    getUserHistory(currentUser.id),
    db.rewardDefinition.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        description: true,
        cost: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.exchange.findMany({
      where: { userId: currentUser.id },
      select: {
        id: true,
        costSnapshot: true,
        comment: true,
        reward: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const exchangeItems = exchanges.map((exchange) => ({
    id: exchange.id,
    rewardName: exchange.reward.name,
    costSnapshot: exchange.costSnapshot,
    comment: exchange.comment,
  }));

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">User Dashboard</h2>
        <p className="text-muted-foreground">Баланс та історія операцій оновлюються з сервера.</p>
      </div>

      <div className="rounded-md border p-4" data-testid="user-current-balance">
        <p className="text-sm text-muted-foreground">Поточний баланс</p>
        <p className="text-3xl font-bold">{balance} очок</p>
      </div>

      <ExchangeSections rewards={rewards} exchanges={exchangeItems} />

      <div className="space-y-3">
        <h3 className="text-lg font-medium">Історія операцій</h3>
        {history.length ? (
          <div className="space-y-2" data-testid="user-history-list">
            {history.map((entry) => (
              <div
                key={`${entry.type}-${entry.id}`}
                className="rounded-md border p-3"
                data-testid={`user-history-item-${entry.type}-${entry.id}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{entry.description}</p>
                  <p
                    className={entry.delta >= 0 ? "font-semibold text-green-700" : "font-semibold text-red-700"}
                  >
                    {entry.delta >= 0 ? `+${entry.delta}` : entry.delta} очок
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Поки що немає операцій.</p>
        )}
      </div>
    </section>
  );
}
