import { redirect } from "next/navigation";

import { getCurrentUser } from "../../../lib/auth";
import { db } from "../../../lib/db";
import { getPendingPointsRequestsForUser } from "../../actions/points";
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

  const [balance, history, rewards, exchanges, pendingRequests] = await Promise.all([
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
    getPendingPointsRequestsForUser(),
  ]);

  const exchangeItems = exchanges.map((exchange) => ({
    id: exchange.id,
    rewardName: exchange.reward.name,
    costSnapshot: exchange.costSnapshot,
    comment: exchange.comment,
  }));

  const historyItems = history.map((entry) => ({
    id: entry.id,
    createdAt: entry.createdAt.toISOString(),
    description: entry.description,
    delta: entry.delta,
    type: entry.type,
  }));

  const pendingRequestItems = pendingRequests.map((request) => ({
    id: request.id,
    amount: request.delta,
    description: request.description,
    createdAt: request.createdAt.toISOString(),
  }));

  return (
    <ExchangeSections
      balance={balance}
      history={historyItems}
      rewards={rewards}
      exchanges={exchangeItems}
      pendingRequests={pendingRequestItems}
    />
  );
}
