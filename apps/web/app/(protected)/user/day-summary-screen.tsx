"use client";

import { Star } from "lucide-react";
import { Card } from "@bonus-tracker/ui";
import { DailyTodoChecklist } from "./daily-todo-checklist";

type DaySummaryScreenProps = {
  balance: number;
  pendingPointsTotal: number;
  onManualRefresh: () => Promise<void>;
  isRefreshing: boolean;
  refreshState?: (options: { showIndicator: boolean }) => Promise<void>;
};

export function DaySummaryScreen({
  balance,
  pendingPointsTotal,
  onManualRefresh,
  isRefreshing,
  refreshState,
}: DaySummaryScreenProps) {
  return (
    <section className="mx-auto w-full max-w-xl space-y-4">
      <h1 className="text-3xl font-semibold text-gray-900">Мій день</h1>

      <Card className="w-full rounded-[30px] border border-gray-200 bg-white px-6 py-8 shadow-lg">
        <div className="text-center">
          <p className="mb-2 text-3xl font-medium text-gray-600">Твій баланс</p>
          <button
            type="button"
            onClick={() => void onManualRefresh()}
            disabled={isRefreshing}
            className="mb-2 flex w-full items-center justify-center gap-3 rounded-2xl transition disabled:cursor-not-allowed disabled:opacity-60"
            data-testid="user-current-balance"
          >
            <Star className="h-12 w-12 fill-yellow-300 text-yellow-300" />
            <p className="text-7xl font-normal text-gray-900">{balance}</p>
          </button>
          <p className="text-xl text-gray-500">очок зароблено</p>
          {pendingPointsTotal > 0 ? (
            <p className="mt-1 text-sm text-gray-500" data-testid="user-pending-points-summary">
              (+{pendingPointsTotal} очок на підтвердженні)
            </p>
          ) : null}
        </div>
      </Card>

      <Card className="w-full rounded-[30px] border border-gray-200 bg-white px-6 py-8 shadow-lg">
        <div className="text-center">
          <p className="mb-6 text-3xl font-medium text-gray-600">Справи на сьогодні</p>
        </div>
        <DailyTodoChecklist
          onRefresh={refreshState ? () => refreshState({ showIndicator: true }) : undefined}
        />
      </Card>
    </section>
  );
}
