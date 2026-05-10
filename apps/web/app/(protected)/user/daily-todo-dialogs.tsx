"use client";

import { X } from "lucide-react";
import { Button } from "@bonus-tracker/ui";

/**
 * Dialog overlay wrapper
 */
function DialogOverlay({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onClose()}
      role="presentation"
      style={{ pointerEvents: "auto" }}
    >
      <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/**
 * Dialog content card
 */
function DialogContent({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <button
        onClick={() => onClose()}
        className="absolute right-4 top-4 rounded-lg p-1 hover:bg-gray-100"
        aria-label="Close"
      >
        <X className="h-5 w-5 text-gray-600" />
      </button>

      {children}
    </div>
  );
}

/**
 * Confirmation dialog: "Чесно-чесно зробив?"
 */
export function CheckConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  return (
    <DialogOverlay isOpen={isOpen} onClose={onCancel}>
      <DialogContent onClose={onCancel}>
        <div className="pt-4" data-testid="daily-todo-check-confirm-dialog">
          <p className="mb-6 text-center text-lg font-semibold text-gray-900">Чесно-чесно зробив?</p>

          <div className="flex gap-3">
            <Button
              onClick={() => onConfirm()}
              disabled={isLoading}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              👍 Чесно-чесно!
            </Button>
            <Button
              onClick={() => onCancel()}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              😄 Пожартував
            </Button>
          </div>
        </div>
      </DialogContent>
    </DialogOverlay>
  );
}

/**
 * Milestone popup: All required done but additional incomplete/empty
 */
export function AllRequiredDonePopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <DialogOverlay isOpen={isOpen} onClose={onClose}>
      <DialogContent onClose={onClose}>
        <div className="space-y-4 pt-4" data-testid="daily-todo-all-required-done-popup">
          <div className="text-center">
            <div className="mb-3 text-5xl">💪</div>
            <p className="text-lg font-semibold text-gray-900">
              Чудово, так тримати! Виконай інші заплановані справи - і отримай додаткове 1 очко!
            </p>
          </div>
        </div>
      </DialogContent>
    </DialogOverlay>
  );
}

/**
 * Milestone popup: All additional done but required incomplete
 */
export function AllAdditionalDonePopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <DialogOverlay isOpen={isOpen} onClose={onClose}>
      <DialogContent onClose={onClose}>
        <div className="space-y-4 pt-4" data-testid="daily-todo-all-additional-done-popup">
          <div className="text-center">
            <div className="mb-3 text-5xl">👍</div>
            <p className="text-lg font-semibold text-gray-900">
              Молодець! Дороби обовʼязкові справи - і отримай додаткове 1 очко!
            </p>
          </div>
        </div>
      </DialogContent>
    </DialogOverlay>
  );
}

/**
 * Congratulations popup: All required and additional done
 */
export function AllCompletedPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <DialogOverlay isOpen={isOpen} onClose={onClose}>
      <DialogContent onClose={onClose}>
        <div className="space-y-4 pt-4" data-testid="daily-todo-all-completed-popup">
          <div className="text-center">
            <div className="mb-3 text-5xl">🎉</div>
            <p className="text-lg font-semibold text-gray-900">
              Круто, ти виконав усі заплановані справи! Лови додаткове 1 очко!
            </p>
          </div>
        </div>
      </DialogContent>
    </DialogOverlay>
  );
}
