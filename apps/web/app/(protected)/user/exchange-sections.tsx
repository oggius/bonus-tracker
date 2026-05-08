"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createExchangeAction } from "../../actions/exchanges";
import { BalanceScreen } from "./balance-screen";
import { HistoryScreen } from "./history-screen";
import { ShopScreen } from "./shop-screen";
import { UserBottomNav } from "./user-bottom-nav";
import {
  type ExchangeItem,
  type HistoryItem,
  type RewardItem,
  type UserScreen,
} from "./exchange-utils";

const SAVED_PIN_STORAGE_KEY = "bonus_tracker_saved_pin";
const PENDING_PIN_SESSION_KEY = "bonus_tracker_pending_pin";

type ExchangeSectionsProps = {
  balance: number;
  history: HistoryItem[];
  rewards: RewardItem[];
  exchanges: ExchangeItem[];
};

export function ExchangeSections({
  balance,
  history,
  rewards,
  exchanges,
}: ExchangeSectionsProps) {
  const router = useRouter();
  const [screen, setScreen] = useState<UserScreen>("balance");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmingRewardId, setConfirmingRewardId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Promote pending PIN (stored in sessionStorage at login) to localStorage
  // only when the user lands on the USER page, never for admin.
  useEffect(() => {
    const pending = sessionStorage.getItem(PENDING_PIN_SESSION_KEY);
    if (pending && /^\d{4}$/.test(pending)) {
      localStorage.setItem(SAVED_PIN_STORAGE_KEY, pending);
    }
    sessionStorage.removeItem(PENDING_PIN_SESSION_KEY);
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

  return (
    <div
      className="relative flex min-h-[calc(100vh-1px)] flex-col pb-24"
      style={{ backgroundColor: "#f3f4f6" }}
    >
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-6 pt-6 md:px-6">
        {screen === "balance" && (
          <BalanceScreen
            balance={balance}
            onNavigateToShop={() => setScreen("shop")}
          />
        )}

        {/*
        Додати очки screen commented out for now.
        Will be re-enabled when admin adds points feature.
        */}

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
