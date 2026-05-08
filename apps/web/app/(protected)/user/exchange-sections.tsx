"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Film,
  History,
  IceCream,
  LogOut,
  Plus,
  ShoppingBag,
  Star,
  Ticket,
  Wallet,
  Youtube,
} from "lucide-react";

import { Button, Card, Input, Label } from "@bonus-tracker/ui";

import { logoutAction } from "../../actions/auth";
import { createExchangeAction, updateExchangeCommentAction } from "../../actions/exchanges";

const SAVED_PIN_STORAGE_KEY = "bonus_tracker_saved_pin";
const PENDING_PIN_SESSION_KEY = "bonus_tracker_pending_pin";

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

type HistoryItem = {
  id: string;
  createdAt: string;
  description: string;
  delta: number;
  type: "POINTS" | "EXCHANGE";
};

type UserScreen = "balance" | "add" | "shop" | "history";

type ExchangeSectionsProps = {
  balance: number;
  history: HistoryItem[];
  rewards: RewardItem[];
  exchanges: ExchangeItem[];
};

const SHOP_CARD_STYLES = [
  {
    gradient: "linear-gradient(90deg, #fee2e2 0%, #fecaca 100%)",
    borderColor: "#fca5a5",
    icon: "text-red-500",
    text: "text-red-900",
    Icon: Youtube,
  },
  {
    gradient: "linear-gradient(90deg, #d1fae5 0%, #a7f3d0 100%)",
    borderColor: "#6ee7b7",
    icon: "text-emerald-500",
    text: "text-emerald-900",
    Icon: Wallet,
  },
  {
    gradient: "linear-gradient(90deg, #fce7f3 0%, #fbcfe8 100%)",
    borderColor: "#f9a8d4",
    icon: "text-pink-500",
    text: "text-pink-900",
    Icon: IceCream,
  },
  {
    gradient: "linear-gradient(90deg, #ede9fe 0%, #ddd6fe 100%)",
    borderColor: "#c4b5fd",
    icon: "text-violet-500",
    text: "text-violet-900",
    Icon: Film,
  },
  {
    gradient: "linear-gradient(90deg, #dbeafe 0%, #bfdbfe 100%)",
    borderColor: "#93c5fd",
    icon: "text-blue-500",
    text: "text-blue-900",
    Icon: Ticket,
  },
] as const;

function getHistoryVisual(entry: HistoryItem) {
  const descriptionLower = entry.description.toLowerCase();

  if (entry.type === "POINTS") {
    return { Icon: Star, iconClass: "text-yellow-400", iconBgClass: "bg-emerald-100" };
  }

  if (descriptionLower.includes("youtube")) {
    return { Icon: Youtube, iconClass: "text-red-500", iconBgClass: "bg-red-100" };
  }

  if (descriptionLower.includes("кишеньков")) {
    return { Icon: Wallet, iconClass: "text-emerald-500", iconBgClass: "bg-emerald-100" };
  }

  if (descriptionLower.includes("морозив")) {
    return { Icon: IceCream, iconClass: "text-pink-500", iconBgClass: "bg-pink-100" };
  }

  if (descriptionLower.includes("кіно")) {
    return { Icon: Film, iconClass: "text-violet-500", iconBgClass: "bg-violet-100" };
  }

  return { Icon: Ticket, iconClass: "text-blue-500", iconBgClass: "bg-blue-100" };
}

function formatHistoryDate(createdAtISO: string) {
  return new Date(createdAtISO).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPointsLabel(points: number) {
  const mod10 = points % 10;
  const mod100 = points % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${points} очко`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${points} очки`;
  }

  return `${points} очок`;
}

export function ExchangeSections({ balance, history, rewards, exchanges }: ExchangeSectionsProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Promote pending PIN (stored in sessionStorage at login) to localStorage
  // only when the user lands on the USER page, never for admin.
  useEffect(() => {
    const pending = sessionStorage.getItem(PENDING_PIN_SESSION_KEY);
    if (pending && /^\d{4}$/.test(pending)) {
      localStorage.setItem(SAVED_PIN_STORAGE_KEY, pending);
    }
    sessionStorage.removeItem(PENDING_PIN_SESSION_KEY);
  }, []);
  const [error, setError] = useState<string | null>(null);
  const [screen, setScreen] = useState<UserScreen>("balance");

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
    <div
      className="relative flex min-h-[calc(100vh-1px)] flex-col pb-24"
      style={{ backgroundColor: "#f3f4f6" }}
    >
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-6 pt-6 md:px-6">
        {screen === "balance" ? (
          <section className="flex min-h-[calc(100vh-180px)] items-center justify-center">
            <Card className="w-full max-w-xl rounded-[30px] border border-gray-200 bg-white px-6 py-8 shadow-lg">
              <div className="text-center">
                <p className="mb-2 text-3xl font-medium text-gray-600">Твій баланс</p>
                <div
                  className="mb-2 flex items-center justify-center gap-3"
                  data-testid="user-current-balance"
                >
                  <Star className="h-12 w-12 fill-yellow-300 text-yellow-300" />
                  <p className="text-7xl font-normal text-gray-900">{balance}</p>
                </div>
                <p className="text-xl text-gray-500">очок зароблено</p>
              </div>

              <button
                type="button"
                onClick={() => setScreen("add")}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-4 text-lg font-semibold text-white shadow-md transition hover:brightness-105"
                style={{ backgroundImage: "linear-gradient(90deg, #facc15 0%, #fb923c 100%)" }}
              >
                <Plus className="h-6 w-6" />
                Додати очки
              </button>
            </Card>
          </section>
        ) : null}

        {screen === "add" ? (
          <section className="mx-auto w-full max-w-xl">
            <Card className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-4xl font-semibold text-gray-900">Додати очки</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-add-points-amount" className="text-xl text-gray-700">
                    Скільки очок?
                  </Label>
                  <Input
                    id="user-add-points-amount"
                    value=""
                    readOnly
                    placeholder="0"
                    className="h-14 rounded-xl border border-gray-200 bg-gray-50 text-center text-4xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-add-points-description" className="text-xl text-gray-700">
                    За що?
                  </Label>
                  <Input
                    id="user-add-points-description"
                    value=""
                    readOnly
                    placeholder="Наприклад: зробив домашнє завдання"
                    className="h-14 rounded-xl border border-gray-200 bg-gray-50 text-lg"
                  />
                </div>

                <Button
                  type="button"
                  disabled
                  className="h-14 w-full rounded-2xl text-lg text-white opacity-80"
                  style={{ backgroundImage: "linear-gradient(90deg, #fde68a 0%, #fdba74 100%)" }}
                >
                  Зберегти
                </Button>

                <p className="text-center text-sm text-gray-500">
                  Нарахування очок виконує адміністратор у розділі керування.
                </p>
              </div>
            </Card>
          </section>
        ) : null}

        {screen === "shop" ? (
          <section className="mx-auto w-full max-w-xl space-y-4">
            <h2 className="text-center text-5xl font-semibold text-gray-900">Магазин бонусів</h2>

            {rewards.length ? (
              <div className="space-y-3" data-testid="user-reward-catalog">
                {rewards.map((reward, index) => {
                  const style = SHOP_CARD_STYLES[index % SHOP_CARD_STYLES.length];

                  return (
                    <Card
                      key={reward.id}
                      className="rounded-3xl border p-4 shadow-sm"
                      style={{
                        backgroundImage: style.gradient,
                        borderColor: style.borderColor,
                      }}
                      data-testid={`user-reward-item-${reward.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white/70 p-3">
                          <style.Icon className={`h-6 w-6 ${style.icon}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-2xl font-semibold ${style.text}`}>{reward.name}</p>
                          <p className="text-lg text-gray-600">Коштує {formatPointsLabel(reward.cost)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`text-4xl font-medium ${style.text}`}>{reward.cost}</span>
                          <Star className="h-6 w-6 fill-yellow-300 text-yellow-300" />
                        </div>
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
                          className="h-12 rounded-2xl bg-black px-6 text-white hover:bg-black/90"
                          data-testid={`exchange-submit-button-${reward.id}`}
                        >
                          {isSubmitting ? "Обробка..." : "Обміняти"}
                        </Button>
                      </form>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-base text-gray-500">Зараз немає активних нагород.</p>
            )}

            <section className="space-y-3">
              <h3 className="text-2xl font-semibold text-gray-900">Мої обміни</h3>

              {exchanges.length ? (
                <div className="space-y-3" data-testid="user-exchanges-list">
                  {exchanges.map((exchange) => (
                    <Card
                      key={exchange.id}
                      className="rounded-2xl border border-gray-200 bg-white p-4"
                      data-testid={`user-exchange-item-${exchange.id}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xl font-semibold text-gray-900">{exchange.rewardName}</p>
                        <p className="text-xl font-semibold text-red-600">-{exchange.costSnapshot}</p>
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
                          className="h-11 rounded-xl"
                          data-testid={`exchange-edit-comment-submit-${exchange.id}`}
                        >
                          {isSubmitting ? "Збереження..." : "Зберегти коментар"}
                        </Button>
                      </form>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-base text-gray-500">Обмінів поки немає.</p>
              )}
            </section>
          </section>
        ) : null}

        {screen === "history" ? (
          <section className="mx-auto w-full max-w-xl space-y-4">
            <h2 className="text-center text-5xl font-semibold text-gray-900">Історія</h2>

            {history.length ? (
              <div className="space-y-3" data-testid="user-history-list">
                {history.map((entry) => {
                  const visual = getHistoryVisual(entry);

                  return (
                    <Card
                      key={`${entry.type}-${entry.id}`}
                      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                      data-testid={`user-history-item-${entry.type}-${entry.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`rounded-xl p-2 ${visual.iconBgClass}`}>
                          <visual.Icon className={`h-5 w-5 ${visual.iconClass}`} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-3xl text-gray-900">{entry.description}</p>
                          <p className="text-xl text-gray-500">{formatHistoryDate(entry.createdAt)}</p>
                        </div>

                        <p
                          className={
                            entry.delta >= 0
                              ? "text-4xl font-medium text-emerald-600"
                              : "text-4xl font-medium text-red-600"
                          }
                        >
                          {entry.delta >= 0 ? `+${entry.delta}` : entry.delta}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                <History className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                <p className="text-gray-500">Поки що немає операцій.</p>
              </Card>
            )}
          </section>
        ) : null}

        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      </div>

      <nav
        className="z-20 border-t border-gray-200 bg-white/95 backdrop-blur"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <div className="mx-auto grid w-full max-w-3xl grid-cols-5 gap-2 px-3 py-2">
          <button
            type="button"
            onClick={() => setScreen("balance")}
            data-testid="user-nav-balance"
            className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs transition ${
              screen === "balance" ? "bg-gray-100 text-gray-900" : "text-gray-500"
            }`}
          >
            <Star className="h-5 w-5" />
            Баланс
          </button>
          <button
            type="button"
            onClick={() => setScreen("add")}
            data-testid="user-nav-add"
            className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs transition ${
              screen === "add" ? "bg-gray-100 text-gray-900" : "text-gray-500"
            }`}
          >
            <Plus className="h-5 w-5" />
            Додати
          </button>
          <button
            type="button"
            onClick={() => setScreen("shop")}
            data-testid="user-nav-shop"
            className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs transition ${
              screen === "shop" ? "bg-gray-100 text-gray-900" : "text-gray-500"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            Магазин
          </button>
          <button
            type="button"
            onClick={() => setScreen("history")}
            data-testid="user-nav-history"
            className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs transition ${
              screen === "history" ? "bg-gray-100 text-gray-900" : "text-gray-500"
            }`}
          >
            <History className="h-5 w-5" />
            Історія
          </button>
          <form
            action={logoutAction}
            className="w-full"
            onSubmit={() => {
              localStorage.removeItem(SAVED_PIN_STORAGE_KEY);
            }}
          >
            <button
              type="submit"
              data-testid="user-nav-logout"
              className="flex w-full flex-col items-center rounded-xl px-2 py-2 text-xs text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
              Вийти
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
}
