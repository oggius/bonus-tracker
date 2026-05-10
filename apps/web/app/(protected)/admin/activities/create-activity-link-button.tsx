"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@bonus-tracker/ui";
import { LoadingSpinner } from "../../../components/loading-spinner";

export function CreateActivityLinkButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);

  const isLoading = isPending || isNavigating;

  const handleClick = () => {
    setIsNavigating(true);

    startTransition(() => {
      router.push("/admin/activities/create");
    });
  };

  return (
    <Button
      type="button"
      className={`loading-section gap-2 ${isLoading ? "loading-section--busy" : ""}`}
      data-testid="create-activity-link"
      disabled={isLoading}
      onClick={handleClick}
    >
      {isLoading ? (
        <>
          <LoadingSpinner />
          Відкриваю...
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          Нова активність
        </>
      )}
    </Button>
  );
}
