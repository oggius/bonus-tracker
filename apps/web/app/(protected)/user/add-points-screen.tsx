"use client";

import { type FormEvent, useState } from "react";
import { Clock3, PlusCircle } from "lucide-react";

import { Button, Card, Input, Label } from "@bonus-tracker/ui";
import { formatHistoryDate, type PendingPointsRequestItem } from "./exchange-utils";

type AddPointsScreenProps = {
  pendingRequests: PendingPointsRequestItem[];
  isSubmitting: boolean;
  onSubmitRequest: (amount: number, description: string) => Promise<void>;
};

export function AddPointsScreen({
  pendingRequests,
  isSubmitting,
  onSubmitRequest,
}: AddPointsScreenProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

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
      <Card className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm">
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
            <PlusCircle className="h-5 w-5" />
            {isSubmitting ? "Надсилання..." : "Надіслати на підтвердження"}
          </Button>
        </form>
      </Card>

      <Card
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        data-testid="user-pending-requests-list"
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">
          <Clock3 className="h-4 w-4" />
          Запити на підтвердженні
        </div>

        {pendingRequests.length ? (
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
        ) : (
          <p className="text-sm text-gray-500">Наразі немає запитів, що очікують підтвердження.</p>
        )}
      </Card>
    </section>
  );
}
