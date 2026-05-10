"use client";

import { useState } from "react";
import { Button } from "@bonus-tracker/ui";
import { LoadingSpinner } from "../../../components/loading-spinner";
import { deleteActivityAction } from "../../../actions/activities";

type DeleteActivityButtonProps = {
  activityId: string;
  description: string;
};

export function DeleteActivityButton({ activityId, description }: DeleteActivityButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const isConfirmed = window.confirm(`Видалити активність "${description}"?`);
    if (!isConfirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteActivityAction(activityId);
      window.location.reload();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
      onClick={handleDelete}
      disabled={isDeleting}
      data-testid={`delete-activity-${activityId}`}
    >
      {isDeleting ? (
        <>
          <LoadingSpinner />
          Видаляю...
        </>
      ) : (
        "Видалити"
      )}
    </Button>
  );
}
