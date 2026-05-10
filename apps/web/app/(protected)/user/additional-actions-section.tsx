"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Input } from "@bonus-tracker/ui";
import { CheckConfirmDialog } from "./daily-todo-dialogs";
import { toast } from "sonner";
import { getRandomMotivationalToast, type AdditionalAction } from "./daily-todo-utils";

type AdditionalActionsSectionProps = {
  additionalActions: AdditionalAction[];
  onAddAdditional: (text: string) => void;
  onRemoveAdditional: (id: string) => void;
  onToggleAdditional: (id: string) => void;
  onEditAdditional: (id: string, newText: string) => void;
};

export function AdditionalActionsSection({
  additionalActions,
  onAddAdditional,
  onRemoveAdditional,
  onToggleAdditional,
  onEditAdditional,
}: AdditionalActionsSectionProps) {
  const [newActionText, setNewActionText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleAddAction = () => {
    const trimmed = newActionText.trim();
    if (trimmed) {
      onAddAdditional(trimmed);
      setNewActionText("");
    }
  };

  const handleStartEdit = (id: string, currentText: string) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const handleSaveEdit = () => {
    if (editingId && editingText.trim()) {
      onEditAdditional(editingId, editingText.trim());
      setEditingId(null);
      setEditingText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleToggleClick = (id: string, isCurrentlyChecked: boolean) => {
    if (!isCurrentlyChecked) {
      // Trying to check → show confirmation
      setConfirmingId(id);
    } else {
      // Trying to uncheck → direct uncheck
      onToggleAdditional(id);
    }
  };

  const handleConfirmCheck = () => {
    if (confirmingId) {
      onToggleAdditional(confirmingId);
      toast(getRandomMotivationalToast());
      setConfirmingId(null);
    }
  };

  const handleCancelCheck = () => {
    setConfirmingId(null);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-600">Додаткові плани</h3>

      {/* Add new action input */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Додай нову справу..."
          value={newActionText}
          onChange={(e) => setNewActionText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddAction();
            }
          }}
          data-testid="daily-todo-add-action-input"
          className="flex-1 h-11 rounded-xl border-gray-200 bg-gray-50"
        />
        <Button
          type="button"
          onClick={handleAddAction}
          disabled={!newActionText.trim()}
          size="sm"
          className="gap-1"
          data-testid="daily-todo-add-action-button"
        >
          <Plus className="h-4 w-4" />
          Додати
        </Button>
      </div>

      {/* List of additional actions */}
      <div className="space-y-2">
        {additionalActions.length === 0 ? (
          <p
            className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-600"
            data-testid="daily-todo-additional-empty-state"
          >
            Жодних додаткових справ. Додай, коли захочеш!
          </p>
        ) : (
          additionalActions.map((action, index) => {
            const isChecked = action.checked;
            const isEditing = editingId === action.id;

            return (
              <div key={action.id} data-testid={`daily-todo-additional-item-${index}`}>
                {isEditing ? (
                  // Edit mode
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveEdit();
                        } else if (e.key === "Escape") {
                          handleCancelEdit();
                        }
                      }}
                      autoFocus
                      className="flex-1"
                      data-testid={`daily-todo-edit-input-${index}`}
                    />
                    <Button
                      type="button"
                      onClick={handleSaveEdit}
                      size="sm"
                      className="bg-sky-500 hover:bg-sky-600 text-white"
                      data-testid={`daily-todo-save-edit-${index}`}
                    >
                      Зберегти
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelEdit}
                      size="sm"
                      variant="outline"
                      data-testid={`daily-todo-cancel-edit-${index}`}
                    >
                      Скасувати
                    </Button>
                  </div>
                ) : (
                  // Display mode
                  <div
                    onClick={() => handleToggleClick(action.id, isChecked)}
                    className={`flex items-center gap-3 rounded-xl border-2 p-3 transition cursor-pointer ${
                      isChecked
                        ? "border-sky-300 bg-sky-50"
                        : "border-gray-200 bg-white hover:border-sky-300 hover:bg-sky-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // Handled by div click
                      className="h-5 w-5 rounded cursor-pointer pointer-events-none"
                      aria-label={action.text}
                    />

                    <span
                      className={`flex-1 ${
                        isChecked
                          ? "text-gray-600 line-through"
                          : "text-gray-700"
                      }`}
                    >
                      {action.text}
                    </span>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(action.id, action.text);
                        }}
                        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        data-testid={`daily-todo-edit-action-${index}`}
                        aria-label="Edit action"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveAdditional(action.id);
                        }}
                        className="rounded p-1 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        data-testid={`daily-todo-delete-action-${index}`}
                        aria-label="Delete action"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <CheckConfirmDialog
        isOpen={confirmingId !== null}
        onConfirm={handleConfirmCheck}
        onCancel={handleCancelCheck}
      />
    </div>
  );
}
