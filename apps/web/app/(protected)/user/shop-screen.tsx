"use client";

import { Star } from "lucide-react";
import { Card } from "@bonus-tracker/ui";
import { RewardTile } from "./reward-tile";
import { ExchangeConfirmDialog } from "./exchange-confirm-dialog";
import { type RewardItem } from "./exchange-utils";

type ShopScreenProps = {
  balance: number;
  rewards: RewardItem[];
  confirmingRewardId: string | null;
  isSubmitting: boolean;
  onRewardClick: (rewardId: string) => void;
  onConfirmExchange: (rewardId: string) => void;
  onCancelExchange: () => void;
};

export function ShopScreen({
  balance,
  rewards,
  confirmingRewardId,
  isSubmitting,
  onRewardClick,
  onConfirmExchange,
  onCancelExchange,
}: ShopScreenProps) {
  return (
    <section className="mx-auto w-full max-w-xl space-y-4">
      <h2 className="text-center text-5xl font-semibold text-gray-900">Магазин бонусів</h2>

      {/* Available Balance Card */}
      <Card className="rounded-[30px] border border-gray-200 bg-white px-6 py-8 shadow-lg">
        <div className="text-center">
          <p className="mb-2 text-3xl font-medium text-gray-600">Доступно очок</p>
          <div className="mb-2 flex items-center justify-center gap-3">
            <Star className="h-12 w-12 fill-yellow-300 text-yellow-300" />
            <p className="text-7xl font-normal text-gray-900">{balance}</p>
          </div>
        </div>
      </Card>

      {rewards.length ? (
        <div className="space-y-3" data-testid="user-reward-catalog">
          {rewards.map((reward) => {
            const isEligible = reward.cost <= balance;

            return (
              <RewardTile
                key={reward.id}
                reward={reward}
                isEligible={isEligible}
                onClick={() => {
                  if (isEligible) {
                    onRewardClick(reward.id);
                  }
                }}
              />
            );
          })}
        </div>
      ) : (
        <p className="text-center text-base text-gray-500">
          Зараз немає активних нагород.
        </p>
      )}

      <ExchangeConfirmDialog
        isOpen={!!confirmingRewardId}
        isLoading={isSubmitting}
        onConfirm={() => {
          if (confirmingRewardId) {
            onConfirmExchange(confirmingRewardId);
          }
        }}
        onCancel={onCancelExchange}
      />
    </section>
  );
}
