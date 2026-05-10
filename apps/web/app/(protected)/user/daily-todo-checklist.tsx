"use client";

import { useEffect, useState } from "react";
import { useDailyTodoState } from "./use-daily-todo-state";
import { RequiredActionsSection } from "./required-actions-section";
import { AdditionalActionsSection } from "./additional-actions-section";
import {
  AllRequiredDonePopup,
  AllAdditionalDonePopup,
  AllCompletedPopup,
} from "./daily-todo-dialogs";
import { submitDailyCompletionBonus } from "./daily-todo-point-request";

type DailyTodoChecklistProps = {
  onRefresh?: () => Promise<void>;
};

export function DailyTodoChecklist({ onRefresh }: DailyTodoChecklistProps) {
  const {
    state,
    isInitialized,
    toggleRequired,
    isRequiredChecked,
    areAllRequiredDone,
    areAllAdditionalDone,
    addAdditional,
    removeAdditional,
    toggleAdditional,
    editAdditional,
    markPopupShown,
    markCompletionSent,
  } = useDailyTodoState();

  const [openDialog, setOpenDialog] = useState<"required" | "additional" | "completed" | null>(null);
  const [isSubmittingPoints, setIsSubmittingPoints] = useState(false);

  // Handle milestone popups and point submission
  useEffect(() => {
    if (!state || !isInitialized) return;

    const allRequiredDone = areAllRequiredDone();
    const allAdditionalDone = areAllAdditionalDone();
    const hasAdditionalActions = state.additionalActions.length > 0;

    // All required done but additional incomplete or empty
    if (
      allRequiredDone &&
      !allAdditionalDone &&
      !state.shownPopups.allRequiredDone
    ) {
      setOpenDialog("required");
      markPopupShown("allRequiredDone");
      return;
    }

    // All additional done but required incomplete
    if (
      allAdditionalDone &&
      !allRequiredDone &&
      !state.shownPopups.allAdditionalDone
    ) {
      setOpenDialog("additional");
      markPopupShown("allAdditionalDone");
      return;
    }

    // All done (required + at least 1 additional)
    if (
      allRequiredDone &&
      allAdditionalDone &&
      hasAdditionalActions &&
      !state.shownPopups.allCompleted
    ) {
      setOpenDialog("completed");
      markPopupShown("allCompleted");

          // Auto-submit point request
      if (!state.sentCompletion) {
        setIsSubmittingPoints(true);
        submitDailyCompletionBonus()
          .then(() => {
            markCompletionSent();
            // Refresh balance and pending requests
            if (onRefresh) {
              return onRefresh();
            }
          })
          .catch((err) => {
            console.error("Failed to submit completion bonus:", err);
          })
          .finally(() => {
            setIsSubmittingPoints(false);
          });
      }
    }
  }, [
    state,
    isInitialized,
    areAllRequiredDone,
    areAllAdditionalDone,
    markPopupShown,
    markCompletionSent,
    onRefresh,
  ]);

  const handleConfirmCheck = (index: number) => {
    toggleRequired(index);
  };

  if (!isInitialized || !state) {
    return null;
  }

  return (
    <div className="space-y-6">
      <RequiredActionsSection
        checkedRequired={state.checkedRequired}
        onToggleRequired={toggleRequired}
        onConfirmCheck={handleConfirmCheck}
        isRequiredChecked={isRequiredChecked}
      />

      <AdditionalActionsSection
        additionalActions={state.additionalActions}
        onAddAdditional={addAdditional}
        onRemoveAdditional={removeAdditional}
        onToggleAdditional={toggleAdditional}
        onEditAdditional={editAdditional}
      />

      {/* Milestone Popups */}
      <AllRequiredDonePopup
        isOpen={openDialog === "required"}
        onClose={() => setOpenDialog(null)}
      />

      <AllAdditionalDonePopup
        isOpen={openDialog === "additional"}
        onClose={() => setOpenDialog(null)}
      />

      <AllCompletedPopup
        isOpen={openDialog === "completed"}
        onClose={() => setOpenDialog(null)}
      />
    </div>
  );
}
