"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button, Card } from "@bonus-tracker/ui";
import {
  approvePointsRequestAction,
  rejectPointsRequestAction,
} from "../../../actions/points";
import { LoadingSpinner } from "../../../components/loading-spinner";

type PendingRequest = {
  id: string;
  delta: number;
  description: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
};

type PendingRequestsBlockProps = {
  requests: PendingRequest[];
};

export function PendingRequestsBlock({ requests }: PendingRequestsBlockProps) {
  const router = useRouter();
  const [isLoadingId, setIsLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async (requestId: string) => {
    setIsLoadingId(requestId);
    setError(null);

    try {
      await approvePointsRequestAction(requestId);
      router.refresh();
      setIsLoadingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Сталася помилка");
      setIsLoadingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setIsLoadingId(requestId);
    setError(null);

    try {
      await rejectPointsRequestAction(requestId);
      router.refresh();
      setIsLoadingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Сталася помилка");
      setIsLoadingId(null);
    }
  };

  if (!requests.length) {
    return null;
  }

  return (
    <Card
      className="rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-sm"
      data-testid="admin-pending-requests-block"
    >
      <h3 className="mb-3 text-2xl font-semibold text-amber-900">Очікують підтвердження</h3>

      <div className="space-y-3">
        {requests.map((request) => {
          const isLoading = isLoadingId === request.id;

          return (
            <div
              key={request.id}
              className={`loading-section rounded-xl border border-amber-200 bg-white p-3 ${
                isLoading ? "loading-section--busy" : ""
              }`}
              data-testid={`admin-pending-request-${request.id}`}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-semibold text-gray-900">{request.user.name}</p>
                <p className="text-lg font-semibold text-emerald-700">+{request.delta} очок</p>
              </div>

              <p className="text-gray-700">{request.description}</p>
              <p className="mt-1 text-sm text-gray-500">
                {new Date(request.createdAt).toLocaleDateString("uk-UA", {
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleApprove(request.id)}
                  data-testid={`admin-approve-request-${request.id}`}
                  className="text-white"
                  style={{ backgroundImage: "linear-gradient(90deg, #16a34a 0%, #22c55e 100%)" }}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      Обробка...
                    </>
                  ) : (
                    "Підтвердити"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isLoading}
                  onClick={() => handleReject(request.id)}
                  data-testid={`admin-reject-request-${request.id}`}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      Обробка...
                    </>
                  ) : (
                    "Відхилити"
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
    </Card>
  );
}
