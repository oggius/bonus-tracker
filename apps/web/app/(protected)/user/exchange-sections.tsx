"use client";

import { useEffect, useRef, useState } from "react";

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
const USER_STATE_POLL_INTERVAL_MS = 60_000;

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
  const [screen, setScreen] = useState<UserScreen>("balance");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmingRewardId, setConfirmingRewardId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stateBalance, setStateBalance] = useState(balance);
  const [stateHistory, setStateHistory] = useState(history);
  const [stateRewards, setStateRewards] = useState(rewards);
  const [stateExchanges, setStateExchanges] = useState(exchanges);
  const [statePendingRequests, setStatePendingRequests] = useState(pendingRequests);

  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshInFlightRef = useRef(false);

  const pendingPointsTotal = statePendingRequests.reduce((sum, request) => sum + request.amount, 0);

  const scheduleNextPoll = () => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
    }

    pollTimeoutRef.current = setTimeout(() => {
      void refreshState();
    }, USER_STATE_POLL_INTERVAL_MS);
  };

  const refreshState = async () => {
    if (refreshInFlightRef.current) {
      return;
    }

    refreshInFlightRef.current = true;
    setIsRefreshing(true);

    try {
      const response = await fetch("/api/user/state", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Не вдалося оновити дані");
      }

      const nextState = (await response.json()) as {
        balance: number;
        history: HistoryItem[];
        rewards: RewardItem[];
        exchanges: ExchangeItem[];
        pendingRequests: PendingPointsRequestItem[];
      };

      setStateBalance(nextState.balance);
      setStateHistory(nextState.history);
      setStateRewards(nextState.rewards);
      setStateExchanges(nextState.exchanges);
      setStatePendingRequests(nextState.pendingRequests);
      setError(null);
    } catch {
      setError("Не вдалося оновити дані. Спробуйте ще раз.");
    } finally {
      setIsRefreshing(false);
      refreshInFlightRef.current = false;
      scheduleNextPoll();
    }
  };

  // Promote pending password (stored in sessionStorage at login) to localStorage
  // only when the user lands on the USER page, never for admin.
  useEffect(() => {
    const pending = sessionStorage.getItem(PENDING_PASSWORD_SESSION_KEY);
    if (pending && pending.trim()) {
      localStorage.setItem(SAVED_PASSWORD_STORAGE_KEY, pending);
    }
    sessionStorage.removeItem(PENDING_PASSWORD_SESSION_KEY);
  }, []);

  useEffect(() => {
    scheduleNextPoll();

    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  const handleConfirmExchange = async (rewardId: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("rewardId", rewardId);
      await createExchangeAction(formData);
      setConfirmingRewardId(null);
      await refreshState();
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
      await refreshState();
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
            balance={stateBalance}
            pendingPointsTotal={pendingPointsTotal}
            onNavigateToAdd={() => setScreen("add")}
            onManualRefresh={refreshState}
            isRefreshing={isRefreshing}
          />
        )}

        {screen === "add" && (
          <AddPointsScreen
            pendingRequests={statePendingRequests}
            isSubmitting={isSubmitting}
            onSubmitRequest={handleCreatePointsRequest}
          />
        )}

        {screen === "shop" && (
          <ShopScreen
            balance={stateBalance}
            rewards={stateRewards}
            confirmingRewardId={confirmingRewardId}
            isSubmitting={isSubmitting}
            onRewardClick={setConfirmingRewardId}
            onConfirmExchange={handleConfirmExchange}
            onCancelExchange={() => setConfirmingRewardId(null)}
            onManualRefresh={refreshState}
            isRefreshing={isRefreshing}
          />
        )}

        {screen === "history" && <HistoryScreen history={stateHistory} />}

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      </div>

      <UserBottomNav activeScreen={screen} onScreenChange={setScreen} />
    </div>
  );
}
