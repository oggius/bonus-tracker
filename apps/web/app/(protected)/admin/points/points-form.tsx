"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button, Input, Label } from "@bonus-tracker/ui";

import { createPointsLogAction } from "../../../actions/points";
import { LoadingSpinner } from "../../../components/loading-spinner";

type UserOption = {
  id: string;
  name: string;
};

type PointsFormProps = {
  users: UserOption[];
};

export function PointsForm({ users }: PointsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await createPointsLogAction(formData);
      router.refresh();
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Сталася помилка");
      setIsLoading(false);
    }
  };

  return (
    <form
      action={handleSubmit}
      className={`loading-section space-y-4 ${isLoading ? "loading-section--busy" : ""}`}
    >
      <div className="space-y-2">
        <Label htmlFor="userId">Користувач</Label>
        <select
          id="userId"
          name="userId"
          required
          disabled={isLoading}
          data-testid="points-user-select"
          className="border-input bg-input-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border px-3 py-1 text-sm outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          defaultValue={users[0]?.id ?? ""}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="actionType">Тип операції</Label>
        <select
          id="actionType"
          name="actionType"
          required
          disabled={isLoading}
          data-testid="points-action-select"
          className="border-input bg-input-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border px-3 py-1 text-sm outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          defaultValue="award"
        >
          <option value="award">Нарахувати</option>
          <option value="deduct">Списати</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Кількість очок</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min="1"
          step="1"
          required
          disabled={isLoading}
          data-testid="points-amount-input"
          placeholder="Наприклад: 3"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Опис</Label>
        <Input
          id="description"
          name="description"
          type="text"
          required
          disabled={isLoading}
          data-testid="points-description-input"
          placeholder="Наприклад: Домашнє завдання"
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button
        type="submit"
        disabled={isLoading}
        data-testid="points-submit-button"
        className="text-white"
        style={{ backgroundImage: "linear-gradient(90deg, #facc15 0%, #fb923c 100%)" }}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            Збереження...
          </>
        ) : (
          "Зберегти операцію"
        )}
      </Button>
    </form>
  );
}
