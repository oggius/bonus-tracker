"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { ChevronRight, Clock3, PlusCircle, Sparkles } from "lucide-react";

import { Button, Card, Input, Label } from "@bonus-tracker/ui";
import { LoadingSpinner } from "../../components/loading-spinner";
import {
  formatHistoryDate,
  formatPointsLabel,
  type ActivitySuggestionItem,
  type PendingPointsRequestItem,
} from "./exchange-utils";

type AddPointsScreenProps = {
  pendingRequests: PendingPointsRequestItem[];
  activitySuggestions: ActivitySuggestionItem[];
  isSubmitting: boolean;
  onSubmitRequest: (amount: number, description: string) => Promise<void>;
};

export function AddPointsScreen({
  pendingRequests,
  activitySuggestions,
  isSubmitting,
  onSubmitRequest,
}: AddPointsScreenProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleActivityClick = (activity: ActivitySuggestionItem) => {
    setDescription(activity.description);
    setAmount(String(activity.points));
    scrollToTop();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedAmount = Number.parseInt(amount, 10);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      return;
    }

    await onSubmitRequest(parsedAmount, trimmedDescription);
    setAmount("");
    setDescription("");
  };

  return (
    <section className="mx-auto w-full max-w-xl space-y-4">
      <Card
        className={`loading-section rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm ${
          isSubmitting ? "loading-section--busy" : ""
        }`}
      >
        <h2 className="mb-6 text-4xl font-semibold text-gray-900">Запросити очки</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-add-points-amount" className="text-xl text-gray-700">
              Скільки очок?
            </Label>
            <Input
              id="user-add-points-amount"
              type="number"
              min="1"
              step="1"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Наприклад: 5"
              disabled={isSubmitting}
              data-testid="user-add-points-amount-input"
              className="h-14 rounded-xl border border-gray-200 bg-gray-50 text-center text-4xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-add-points-description" className="text-xl text-gray-700">
              За що?
            </Label>
            <Input
              id="user-add-points-description"
              type="text"
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Наприклад: зробив домашнє завдання"
              disabled={isSubmitting}
              data-testid="user-add-points-description-input"
              className="h-14 rounded-xl border border-gray-200 bg-gray-50 text-lg"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            data-testid="user-add-points-submit-button"
            className="h-14 w-full rounded-2xl text-lg text-white"
            style={{ backgroundImage: "linear-gradient(90deg, #facc15 0%, #fb923c 100%)" }}
          >
            {isSubmitting ? <LoadingSpinner /> : <PlusCircle className="h-5 w-5" />}
            {isSubmitting ? "Надсилання..." : "Надіслати на підтвердження"}
          </Button>
        </form>
      </Card>

      {pendingRequests.length ? (
        <Card
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          data-testid="user-pending-requests-list"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">
            <Clock3 className="h-4 w-4" />
            Запити на підтвердженні
          </div>

          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-3"
                data-testid={`user-pending-request-${request.id}`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xl font-semibold text-gray-900">+{request.amount} очок</p>
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                    Очікує
                  </span>
                </div>
                <p className="text-gray-700">{request.description}</p>
                <p className="mt-1 text-sm text-gray-500">{formatHistoryDate(request.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {activitySuggestions.length ? (
        <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm" data-testid="user-activities-helper">
          <button
            type="button"
            onClick={() => setIsActivitiesExpanded(!isActivitiesExpanded)}
            className="flex w-full items-center justify-between gap-2 p-5 text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-sm text-sky-700">
              <Sparkles className="h-4 w-4" />
              Популярні активності
            </div>
            <ChevronRight
              className="h-5 w-5 shrink-0 text-sky-700 transition-transform duration-300"
              style={{
                transform: isActivitiesExpanded ? "rotate(90deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {isActivitiesExpanded && (
            <div className="border-t border-gray-200 px-5 pb-5 pt-3">
              <div className="space-y-2">
                {activitySuggestions.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition hover:border-sky-300 hover:bg-sky-50"
                    onClick={() => handleActivityClick(activity)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleActivityClick(activity);
                      }
                    }}
                    data-testid={`activity-suggestion-${activity.id}`}
                  >
                    <div>
                      <p className="text-gray-800">{activity.description}</p>
                      <p className="text-xs text-gray-500">{formatPointsLabel(activity.points)}</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="h-9 w-9 rounded-lg border border-sky-200 bg-white p-0 text-sky-700 hover:bg-sky-100"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleActivityClick(activity);
                      }}
                      data-testid={`activity-suggestion-apply-${activity.id}`}
                    >
                      +
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ) : null}
    </section>
  );
}
