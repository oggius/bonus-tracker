"use client";

import { Star } from "lucide-react";
import { SHOP_CARD_STYLES, formatPointsLabel, type RewardItem } from "./exchange-utils";

type RewardTileProps = {
  reward: RewardItem;
  isEligible: boolean;
  onClick: () => void;
};

export function RewardTile({ reward, isEligible, onClick }: RewardTileProps) {
  const styleIndex = Math.abs(reward.id.charCodeAt(0) % SHOP_CARD_STYLES.length);
  const style = SHOP_CARD_STYLES[styleIndex];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isEligible}
      className={`w-full rounded-3xl border p-4 shadow-sm transition ${
        isEligible ? "cursor-pointer hover:shadow-md" : "cursor-not-allowed opacity-50"
      }`}
      style={{
        backgroundImage: isEligible
          ? style.gradient
          : "linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%)",
        borderColor: isEligible ? style.borderColor : "#d1d5db",
      }}
      data-testid={`user-reward-item-${reward.id}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`rounded-xl p-3 ${isEligible ? "bg-white/70" : "bg-gray-300/50"}`}
        >
          <style.Icon
            className={`h-6 w-6 ${isEligible ? style.icon : "text-gray-400"}`}
          />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p
            className={`truncate text-2xl font-semibold ${
              isEligible ? style.text : "text-gray-500"
            }`}
          >
            {reward.name}
          </p>
          <p
            className={`text-lg ${
              isEligible ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Коштує {formatPointsLabel(reward.cost)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={`text-4xl font-medium ${
              isEligible ? style.text : "text-gray-400"
            }`}
          >
            {reward.cost}
          </span>
          <Star className="h-6 w-6 fill-yellow-300 text-yellow-300" />
        </div>
      </div>
    </button>
  );
}
