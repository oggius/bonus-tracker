"use client";

import { ShoppingBag, Star } from "lucide-react";
import { Card } from "@bonus-tracker/ui";

type BalanceScreenProps = {
  balance: number;
  onNavigateToShop: () => void;
};

export function BalanceScreen({ balance, onNavigateToShop }: BalanceScreenProps) {
  return (
    <section className="flex min-h-[calc(100vh-180px)] items-center justify-center">
      <Card className="w-full max-w-xl rounded-[30px] border border-gray-200 bg-white px-6 py-8 shadow-lg">
        <div className="text-center">
          <p className="mb-2 text-3xl font-medium text-gray-600">Твій баланс</p>
          <div
            className="mb-2 flex items-center justify-center gap-3"
            data-testid="user-current-balance"
          >
            <Star className="h-12 w-12 fill-yellow-300 text-yellow-300" />
            <p className="text-7xl font-normal text-gray-900">{balance}</p>
          </div>
          <p className="text-xl text-gray-500">очок зароблено</p>
        </div>

        {balance > 0 ? (
          <button
            type="button"
            onClick={onNavigateToShop}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-4 text-lg font-semibold text-white shadow-md transition hover:brightness-105"
            style={{ backgroundImage: "linear-gradient(90deg, #facc15 0%, #fb923c 100%)" }}
          >
            <ShoppingBag className="h-6 w-6" />
            Обміняти очки
          </button>
        ) : null}
      </Card>
    </section>
  );
}
