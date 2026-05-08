"use client";

import { History } from "lucide-react";
import { Card } from "@bonus-tracker/ui";
import { formatHistoryDate, getHistoryVisual, type HistoryItem } from "./exchange-utils";

type HistoryScreenProps = {
  history: HistoryItem[];
};

export function HistoryScreen({ history }: HistoryScreenProps) {
  return (
    <section className="mx-auto w-full max-w-xl space-y-4">
      <h2 className="text-center text-5xl font-semibold text-gray-900">Історія</h2>

      {history.length ? (
        <div className="space-y-3" data-testid="user-history-list">
          {history.map((entry) => {
            const visual = getHistoryVisual(entry);

            return (
              <Card
                key={`${entry.type}-${entry.id}`}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                data-testid={`user-history-item-${entry.type}-${entry.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`rounded-xl p-2 ${visual.iconBgClass}`}>
                    <visual.Icon className={`h-5 w-5 ${visual.iconClass}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-3xl text-gray-900">{entry.description}</p>
                    <p className="text-xl text-gray-500">{formatHistoryDate(entry.createdAt)}</p>
                  </div>

                  <p
                    className={
                      entry.delta >= 0
                        ? "text-4xl font-medium text-emerald-600"
                        : "text-4xl font-medium text-red-600"
                    }
                  >
                    {entry.delta >= 0 ? `+${entry.delta}` : entry.delta}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <History className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <p className="text-gray-500">Поки що немає операцій.</p>
        </Card>
      )}
    </section>
  );
}
