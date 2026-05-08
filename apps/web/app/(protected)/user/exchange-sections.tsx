"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button, Card, Input, Label } from "@bonus-tracker/ui";

import { createExchangeAction, updateExchangeCommentAction } from "../../actions/exchanges";

type RewardItem = {
  id: string;
  name: string;
  description: string | null;
  cost: number;
};

type ExchangeItem = {
  id: string;
  rewardName: string;
  costSnapshot: number;
  comment: string | null;
};

type ExchangeSectionsProps = {
  rewards: RewardItem[];
  exchanges: ExchangeItem[];
};

export function ExchangeSections({ rewards, exchanges }: ExchangeSectionsProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateExchange = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await createExchangeAction(formData);
      router.refresh();
      setIsSubmitting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Сталася помилка");
      setIsSubmitting(false);
    }
  };

  const handleUpdateComment = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await updateExchangeCommentAction(formData);
      router.refresh();
      setIsSubmitting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Сталася помилка");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="text-lg font-medium">Каталог нагород</h3>

        {rewards.length ? (
          <div className="space-y-3" data-testid="user-reward-catalog">
            {rewards.map((reward) => (
              <Card key={reward.id} className="p-4" data-testid={`user-reward-item-${reward.id}`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{reward.name}</p>
                    <p className="font-semibold">{reward.cost} очок</p>
                  </div>
                  {reward.description ? (
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                  ) : null}
                </div>

                <form action={handleCreateExchange} className="mt-3 space-y-2">
                  <input type="hidden" name="rewardId" value={reward.id} />
                  <div className="space-y-1">
                    <Label htmlFor={`reward-comment-${reward.id}`}>Коментар (необов'язково)</Label>
                    <Input
                      id={`reward-comment-${reward.id}`}
                      name="comment"
                      placeholder="Наприклад: Хочу на вихідних"
                      disabled={isSubmitting}
                      data-testid={`exchange-comment-input-${reward.id}`}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    data-testid={`exchange-submit-button-${reward.id}`}
                  >
                    {isSubmitting ? "Обробка..." : "Обміняти"}
                  </Button>
                </form>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Зараз немає активних нагород.</p>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-medium">Мої обміни</h3>

        {exchanges.length ? (
          <div className="space-y-3" data-testid="user-exchanges-list">
            {exchanges.map((exchange) => (
              <Card key={exchange.id} className="p-4" data-testid={`user-exchange-item-${exchange.id}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{exchange.rewardName}</p>
                  <p className="font-semibold">-{exchange.costSnapshot} очок</p>
                </div>

                <form action={handleUpdateComment} className="mt-3 space-y-2">
                  <input type="hidden" name="exchangeId" value={exchange.id} />
                  <div className="space-y-1">
                    <Label htmlFor={`exchange-comment-${exchange.id}`}>Коментар</Label>
                    <Input
                      id={`exchange-comment-${exchange.id}`}
                      name="comment"
                      defaultValue={exchange.comment ?? ""}
                      placeholder="Додайте або оновіть коментар"
                      disabled={isSubmitting}
                      data-testid={`exchange-edit-comment-input-${exchange.id}`}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={isSubmitting}
                    data-testid={`exchange-edit-comment-submit-${exchange.id}`}
                  >
                    {isSubmitting ? "Збереження..." : "Зберегти коментар"}
                  </Button>
                </form>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Обмінів поки немає.</p>
        )}
      </section>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
