"use client";

import { useState } from "react";
import { CheckConfirmDialog } from "./daily-todo-dialogs";
import { REQUIRED_ACTIONS } from "./daily-todo-utils";
import { toast } from "sonner";
import { getRandomMotivationalToast } from "./daily-todo-utils";

type RequiredActionsSectionProps = {
  checkedRequired: Set<string>;
  onToggleRequired: (index: number) => void;
  onConfirmCheck: (index: number) => void;
  isRequiredChecked: (index: number) => boolean;
};

export function RequiredActionsSection({
  checkedRequired,
  onToggleRequired,
  onConfirmCheck,
  isRequiredChecked,
}: RequiredActionsSectionProps) {
  const [confirmingIndex, setConfirmingIndex] = useState<number | null>(null);

  const handleToggleClick = (index: number) => {
    const isCurrentlyChecked = isRequiredChecked(index);

    if (!isCurrentlyChecked) {
      // Trying to check → show confirmation
      setConfirmingIndex(index);
    } else {
      // Trying to uncheck → direct uncheck
      onToggleRequired(index);
    }
  };

  const handleConfirm = () => {
    if (confirmingIndex !== null) {
      onConfirmCheck(confirmingIndex);
      toast(getRandomMotivationalToast());
      setConfirmingIndex(null);
    }
  };

  const handleCancel = () => {
    setConfirmingIndex(null);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-600">Обовʼязкові справи</h3>

      <div className="space-y-2">
        {REQUIRED_ACTIONS.map((action, index) => {
          const isChecked = isRequiredChecked(index);
          return (
            <div
              key={index}
              onClick={() => handleToggleClick(index)}
              className={`flex items-center gap-3 rounded-xl border-2 p-3 transition cursor-pointer ${
                isChecked
                  ? "border-sky-300 bg-sky-50"
                  : "border-gray-200 bg-white hover:border-sky-300 hover:bg-sky-50"
              }`}
              data-testid={`daily-todo-required-item-${index}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}} // Handled by div click
                className="h-5 w-5 rounded cursor-pointer pointer-events-none"
                aria-label={action}
              />
              <span
                className={`flex-1 ${
                  isChecked
                    ? "text-gray-600 line-through"
                    : "text-gray-700"
                }`}
              >
                {action}
              </span>
            </div>
          );
        })}
      </div>

      <CheckConfirmDialog
        isOpen={confirmingIndex !== null}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
