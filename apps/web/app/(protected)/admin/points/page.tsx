import Link from "next/link";
import { History, ListChecks, Users } from "lucide-react";

import { Button, Card } from "@bonus-tracker/ui";

import { requireAdminUser } from "../../../../lib/auth";
import {
  getPendingPointsRequestsForAdmin,
  getPointsHistoryForAdmin,
  getUserBalanceForAdmin,
  getUsersForPointsAdmin,
} from "../../../actions/points";
import { PendingRequestsBlock } from "./pending-requests-block";
import { PointsForm } from "./points-form";

type AdminPendingRequest = {
  id: string;
  delta: number;
  description: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  };
};

type AdminHistoryEntry = {
  id: string;
  delta: number;
  description: string;
  status: "APPROVED" | "REJECTED";
  initiatedBy: "USER" | "ADMIN";
  user: {
    id: string;
    name: string;
  };
};

export default async function AdminPointsPage() {
  await requireAdminUser();

  const [users, historyRaw, pendingRequestsRaw] = await Promise.all([
    getUsersForPointsAdmin(),
    getPointsHistoryForAdmin(),
    getPendingPointsRequestsForAdmin(),
  ]);

  const history = historyRaw as unknown as AdminHistoryEntry[];
  const pendingRequests = pendingRequestsRaw as unknown as AdminPendingRequest[];

  const usersWithBalance = await Promise.all(
    users.map(async (user) => ({
      ...user,
      balance: await getUserBalanceForAdmin(user.id),
    }))
  );

  const pendingRequestItems = pendingRequests.map((request) => ({
    id: request.id,
    delta: request.delta,
    description: request.description,
    createdAt: request.createdAt.toISOString(),
    user: request.user,
  }));

  return (
    <section className="space-y-6">
      <Card className="rounded-[30px] border border-gray-200 bg-white px-6 py-8 shadow-lg">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-emerald-50 p-3">
            <ListChecks className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-semibold text-gray-900">Управління очками</h2>
          <p className="mt-2 text-lg text-gray-600">Операції нарахування та списання з повною історією.</p>
        </div>
      </Card>

      <Card className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-sm text-sky-700">
          <Users className="h-4 w-4" />
          Баланс користувачів
        </div>
        {usersWithBalance.length ? (
          <div className="space-y-2" data-testid="users-balance-list">
            {usersWithBalance.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
                data-testid={`user-balance-${user.id}`}
              >
                <span className="text-gray-800">{user.name}</span>
                <span className="font-semibold text-gray-900">{user.balance} очок</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Користувачі не знайдені.</p>
        )}
      </Card>

      <PendingRequestsBlock requests={pendingRequestItems} />

      <Card className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-2xl font-semibold text-gray-900">Додати операцію</h3>
        {users.length ? (
          <PointsForm users={users} />
        ) : (
          <p className="text-sm text-gray-500">Немає користувачів для операцій.</p>
        )}
      </Card>

      <Card className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm text-violet-700">
          <History className="h-4 w-4" />
          Історія операцій
        </div>
        {history.length ? (
          <div className="space-y-2" data-testid="points-history-list">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border border-gray-200 bg-white p-3"
                data-testid={`points-log-${entry.id}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium text-gray-900">{entry.user.name}</p>
                  <p
                    className={entry.delta >= 0 ? "font-semibold text-green-700" : "font-semibold text-red-700"}
                  >
                    {entry.delta >= 0 ? `+${entry.delta}` : entry.delta} очок
                  </p>
                </div>
                <p className="text-sm text-gray-500">{entry.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={`rounded-full px-2 py-1 font-medium ${
                      entry.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {entry.status === "APPROVED" ? "Підтверджено" : "Відхилено"}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                    {entry.initiatedBy === "USER" ? "Ініціатор: користувач" : "Ініціатор: адміністратор"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Операцій ще немає.</p>
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
