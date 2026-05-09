"use client";

import { PlusCircle, Star } from "lucide-react";
import { Card } from "@bonus-tracker/ui";

type BalanceScreenProps = {
  balance: number;
  pendingPointsTotal: number;
  onNavigateToAdd: () => void;
  onManualRefresh: () => Promise<void>;
  isRefreshing: boolean;
};

export function BalanceScreen({
  balance,
  pendingPointsTotal,
  onNavigateToAdd,
  onManualRefresh,
  isRefreshing,
}: BalanceScreenProps) {
  return (
    <section className="flex min-h-[calc(100vh-180px)] items-center justify-center">
      <Card className="w-full max-w-xl rounded-[30px] border border-gray-200 bg-white px-6 py-8 shadow-lg">
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

        {balance > 0 ? (
          <button
            type="button"
            onClick={onNavigateToAdd}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-4 text-lg font-semibold text-white shadow-md transition hover:brightness-105"
            style={{ backgroundImage: "linear-gradient(90deg, #facc15 0%, #fb923c 100%)" }}
          >
            <PlusCircle className="h-6 w-6" />
            Додати очки
          </button>
        ) : null}
      </Card>
    </section>
  );
}
