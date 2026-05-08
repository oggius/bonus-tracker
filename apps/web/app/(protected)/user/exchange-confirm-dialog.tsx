"use client";

import { Card } from "@bonus-tracker/ui";

type ExchangeConfirmDialogProps = {
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ExchangeConfirmDialog({
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
}: ExchangeConfirmDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-xs rounded-[30px] border border-gray-200 bg-white p-6 shadow-lg">
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-3xl font-semibold text-gray-900">Впевнений?</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 rounded-2xl bg-green-500 px-4 py-3 text-lg font-semibold text-white transition hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? "Обробка..." : "Так!"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-lg font-semibold text-gray-900 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Передумав
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
