"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button, Input, Label } from "@bonus-tracker/ui";
import { LoadingSpinner } from "../../../components/loading-spinner";

type ActivityFormProps = {
  action: (formData: FormData) => Promise<unknown>;
  initialData?: {
    id: string;
    description: string;
    points: number;
  };
  submitLabel?: string;
};

export function ActivityForm({
  action,
  initialData,
  submitLabel = "Додати активність",
}: ActivityFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);

    startTransition(async () => {
      try {
        await action(formData);
        router.push("/admin/activities");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Сталася помилка");
      }
    });
  };

  return (
    <form
      action={handleSubmit}
      className={`loading-section space-y-6 ${isPending ? "loading-section--busy" : ""}`}
      aria-busy={isPending}
    >
      {initialData?.id ? <input type="hidden" name="id" value={initialData.id} /> : null}

      <div className="space-y-2">
        <Label htmlFor="description">Опис активності *</Label>
        <Input
          id="description"
          name="description"
          type="text"
          placeholder="Наприклад: прибрав кімнату"
          defaultValue={initialData?.description ?? ""}
          required
          disabled={isPending}
          data-testid="activity-description-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="points">Кількість очок *</Label>
        <Input
          id="points"
          name="points"
          type="number"
          placeholder="Наприклад: 5"
          defaultValue={initialData?.points ?? ""}
          required
          disabled={isPending}
          min="1"
          step="1"
          data-testid="activity-points-input"
        />
      </div>

      {error ? (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        data-testid="activity-submit-button"
        className="text-white"
        style={{ backgroundImage: "linear-gradient(90deg, #facc15 0%, #fb923c 100%)" }}
      >
        {isPending ? (
          <>
            <LoadingSpinner />
            Обробка...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
