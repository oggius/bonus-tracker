import Link from "next/link";
import { redirect } from "next/navigation";

import { Button, Card } from "@bonus-tracker/ui";

import { getCurrentUser } from "../../../../lib/auth";
import {
  getPointsHistoryForAdmin,
  getUserBalanceForAdmin,
  getUsersForPointsAdmin,
} from "../../../actions/points";
import { PointsForm } from "./points-form";

export default async function AdminPointsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/");
  }

  if (currentUser.role !== "ADMIN") {
    redirect("/user");
  }

  const [users, history] = await Promise.all([
    getUsersForPointsAdmin(),
    getPointsHistoryForAdmin(),
  ]);

  const usersWithBalance = await Promise.all(
    users.map(async (user) => ({
      ...user,
      balance: await getUserBalanceForAdmin(user.id),
    }))
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Управління очками</h2>
        <Link href="/admin">
          <Button variant="outline">Назад до панелі</Button>
        </Link>
      </div>

      <Card className="p-4">
        <h3 className="mb-3 text-lg font-medium">Баланс користувачів</h3>
        {usersWithBalance.length ? (
          <div className="space-y-2" data-testid="users-balance-list">
            {usersWithBalance.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-md border p-2"
                data-testid={`user-balance-${user.id}`}
              >
                <span>{user.name}</span>
                <span className="font-semibold">{user.balance} очок</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Користувачі не знайдені.</p>
        )}
      </Card>

      <Card className="p-4">
        <h3 className="mb-3 text-lg font-medium">Додати операцію</h3>
        {users.length ? (
          <PointsForm users={users} />
        ) : (
          <p className="text-sm text-muted-foreground">Немає користувачів для операцій.</p>
        )}
      </Card>

      <Card className="p-4">
        <h3 className="mb-3 text-lg font-medium">Історія операцій</h3>
        {history.length ? (
          <div className="space-y-2" data-testid="points-history-list">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="rounded-md border p-3"
                data-testid={`points-log-${entry.id}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{entry.user.name}</p>
                  <p
                    className={entry.delta >= 0 ? "font-semibold text-green-700" : "font-semibold text-red-700"}
                  >
                    {entry.delta >= 0 ? `+${entry.delta}` : entry.delta} очок
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{entry.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Операцій ще немає.</p>
        )}
      </Card>
    </section>
  );
}
