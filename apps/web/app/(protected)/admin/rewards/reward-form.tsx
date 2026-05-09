"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@bonus-tracker/ui";
import { Input } from "@bonus-tracker/ui";
import { Label } from "@bonus-tracker/ui";
import { LoadingSpinner } from "../../../components/loading-spinner";

interface RewardFormProps {
  action: (formData: FormData) => Promise<unknown>;
  initialData?: {
    id: string;
    name: string;
    cost: number;
    description: string;
  };
  submitLabel?: string;
}

export function RewardForm({
  action,
  initialData,
  submitLabel = "Додати нагороду",
}: RewardFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await action(formData);
      router.push("/admin/rewards");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Сталася помилка");
      setIsLoading(false);
    }
  };

  return (
    <form
      action={handleSubmit}
      className={`loading-section space-y-6 ${isLoading ? "loading-section--busy" : ""}`}
    >
      {initialData?.id ? <input type="hidden" name="id" value={initialData.id} /> : null}

      <div className="space-y-2">
        <Label htmlFor="name">Назва нагороди *</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Наприклад: 20 хвилин YouTube"
          defaultValue={initialData?.name ?? ""}
          required
          disabled={isLoading}
          data-testid="reward-name-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cost">Вартість (в очках) *</Label>
        <Input
          id="cost"
          name="cost"
          type="number"
          placeholder="Наприклад: 5"
          defaultValue={initialData?.cost ?? ""}
          required
          disabled={isLoading}
          min="1"
          data-testid="reward-cost-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Опис (необов'язково)</Label>
        <textarea
          id="description"
          name="description"
          placeholder="Додатки інформації про цю нагороду"
          defaultValue={initialData?.description ?? ""}
          disabled={isLoading}
          data-testid="reward-description-input"
          className="border-input bg-input-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {error ? (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      ) : null}

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isLoading}
          data-testid="reward-submit-button"
          className="text-white"
          style={{ backgroundImage: "linear-gradient(90deg, #facc15 0%, #fb923c 100%)" }}
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Обробка...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
