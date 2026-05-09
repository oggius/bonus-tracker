"use client";

import { useState } from "react";
import { Button } from "@bonus-tracker/ui";
import { deactivateRewardAction } from "../../../actions/rewards";
import { LoadingSpinner } from "../../../components/loading-spinner";

export function DeactivateRewardButton({ rewardId }: { rewardId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeactivate = async () => {
    if (!confirm("Ви впевнені, що хочете деактивувати цю нагороду?")) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await deactivateRewardAction(rewardId);
      // Reload the page to reflect changes
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Сталася помилка деактивації"
      );
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className={`loading-section inline-flex ${isLoading ? "loading-section--busy" : ""}`}>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDeactivate}
        disabled={isLoading}
        data-testid={`deactivate-reward-button-${rewardId}`}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            Деактивація...
          </>
        ) : (
          "Деактивувати"
        )}
      </Button>
    </div>
  );
}
