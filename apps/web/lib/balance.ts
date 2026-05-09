import "server-only";

import { db } from "./db";

export async function getUserBalance(userId: string) {
  const [pointsAgg, exchangesAgg] = await Promise.all([
    db.pointsLog.aggregate({
      where: {
        userId,
        status: "APPROVED",
      },
      _sum: { delta: true },
    }),
    db.exchange.aggregate({
      where: { userId },
      _sum: { costSnapshot: true },
    }),
  ]);

  const pointsTotal = pointsAgg._sum.delta ?? 0;
  const exchangeTotal = exchangesAgg._sum.costSnapshot ?? 0;

  return pointsTotal - exchangeTotal;
}

type UserHistoryItem = {
  id: string;
  createdAt: Date;
  description: string;
  delta: number;
  type: "POINTS" | "EXCHANGE";
};

export async function getUserHistory(userId: string): Promise<UserHistoryItem[]> {
  const [pointsLogs, exchanges] = await Promise.all([
    db.pointsLog.findMany({
      where: {
        userId,
        status: "APPROVED",
      },
      select: {
        id: true,
        createdAt: true,
        description: true,
        delta: true,
      },
    }),
    db.exchange.findMany({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
        costSnapshot: true,
        comment: true,
        reward: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const pointItems: UserHistoryItem[] = pointsLogs.map((entry) => ({
    id: entry.id,
    createdAt: entry.createdAt,
    description: entry.description,
    delta: entry.delta,
    type: "POINTS",
  }));

  const exchangeItems: UserHistoryItem[] = exchanges.map((exchange) => {
    const baseDescription = `Обмін на: ${exchange.reward.name}`;
    const description = exchange.comment
      ? `${baseDescription} (${exchange.comment})`
      : baseDescription;

    return {
      id: exchange.id,
      createdAt: exchange.createdAt,
      description,
      delta: -exchange.costSnapshot,
      type: "EXCHANGE",
    };
  });

  return [...pointItems, ...exchangeItems].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}
