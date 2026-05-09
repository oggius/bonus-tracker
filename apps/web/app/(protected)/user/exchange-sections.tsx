"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createPointsRequestAction } from "../../actions/points";
import { createExchangeAction } from "../../actions/exchanges";
import { AddPointsScreen } from "./add-points-screen";
import { BalanceScreen } from "./balance-screen";
import { HistoryScreen } from "./history-screen";
import { ShopScreen } from "./shop-screen";
import { UserBottomNav } from "./user-bottom-nav";
import {
  type ExchangeItem,
  type HistoryItem,
  type PendingPointsRequestItem,
  type RewardItem,
  type UserScreen,
} from "./exchange-utils";

const SAVED_PASSWORD_STORAGE_KEY = "bonus_tracker_saved_password";
const PENDING_PASSWORD_SESSION_KEY = "bonus_tracker_pending_password";

type ExchangeSectionsProps = {
  balance: number;
  history: HistoryItem[];
  rewards: RewardItem[];
  exchanges: ExchangeItem[];
  pendingRequests: PendingPointsRequestItem[];
};

export function ExchangeSections({
  balance,
  history,
  rewards,
  exchanges,
  pendingRequests,
}: ExchangeSectionsProps) {
  const router = useRouter();
  const [screen, setScreen] = useState<UserScreen>("balance");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmingRewardId, setConfirmingRewardId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pendingPointsTotal = pendingRequests.reduce((sum, request) => sum + request.amount, 0);

  // Promote pending password (stored in sessionStorage at login) to localStorage
  // only when the user lands on the USER page, never for admin.
  useEffect(() => {
    const pending = sessionStorage.getItem(PENDING_PASSWORD_SESSION_KEY);
    if (pending && pending.trim()) {
      localStorage.setItem(SAVED_PASSWORD_STORAGE_KEY, pending);
    }
    sessionStorage.removeItem(PENDING_PASSWORD_SESSION_KEY);
  }, []);

  const handleConfirmExchange = async (rewardId: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("rewardId", rewardId);
      await createExchangeAction(formData);
      router.refresh();
      setConfirmingRewardId(null);
      setIsSubmitting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Сталася помилка");
      setIsSubmitting(false);
    }
  };

  const handleCreatePointsRequest = async (amount: number, description: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("amount", String(amount));
      formData.append("description", description);
      await createPointsRequestAction(formData);
      router.refresh();
      setIsSubmitting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Сталася помилка");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative flex min-h-[calc(100vh-1px)] flex-col pb-24"
      style={{ backgroundColor: "#f3f4f6" }}
    >
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-6 pt-6 md:px-6">
        {screen === "balance" && (
          <BalanceScreen
            balance={balance}
            pendingPointsTotal={pendingPointsTotal}
            onNavigateToAdd={() => setScreen("add")}
          />
        )}

        {screen === "add" && (
          <AddPointsScreen
            pendingRequests={pendingRequests}
            isSubmitting={isSubmitting}
            onSubmitRequest={handleCreatePointsRequest}
          />
        )}

        {screen === "shop" && (
          <ShopScreen
            balance={balance}
            rewards={rewards}
            confirmingRewardId={confirmingRewardId}
            isSubmitting={isSubmitting}
            onRewardClick={setConfirmingRewardId}
            onConfirmExchange={handleConfirmExchange}
            onCancelExchange={() => setConfirmingRewardId(null)}
          />
        )}

        {screen === "history" && <HistoryScreen history={history} />}

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      </div>

      <UserBottomNav activeScreen={screen} onScreenChange={setScreen} />
    </div>
  );
}
