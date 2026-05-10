import { NextResponse } from "next/server";

import { getCurrentUser } from "../../../../lib/auth";
import { getUserBalance, getUserHistory } from "../../../../lib/balance";
import { db } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Неавторизований доступ" }, { status: 401 });
  }

  if (currentUser.role !== "USER") {
    return NextResponse.json({ error: "Недостатньо прав доступу" }, { status: 403 });
  }

  const [balance, history, rewards, exchanges, pendingRequests, activities] = await Promise.all([
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
    db.pointsLog.findMany({
      where: {
        userId: currentUser.id,
        status: "PENDING",
        initiatedBy: "USER",
      } as any,
      select: {
        id: true,
        delta: true,
        description: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.activity.findMany({
      select: {
        id: true,
        description: true,
        points: true,
        order: true,
      },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  return NextResponse.json({
    balance,
    rewards,
    exchanges: exchanges.map((exchange) => ({
      id: exchange.id,
      rewardName: exchange.reward.name,
      costSnapshot: exchange.costSnapshot,
      comment: exchange.comment,
    })),
    history: history.map((entry) => ({
      id: entry.id,
      createdAt: entry.createdAt.toISOString(),
      description: entry.description,
      delta: entry.delta,
      type: entry.type,
    })),
    pendingRequests: pendingRequests.map((request) => ({
      id: request.id,
      amount: request.delta,
      description: request.description,
      createdAt: request.createdAt.toISOString(),
    })),
    activitySuggestions: activities.map((activity) => ({
      id: activity.id,
      description: activity.description,
      points: activity.points,
      order: activity.order,
    })),
  });
}
