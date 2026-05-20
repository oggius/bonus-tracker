"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";

import { Button } from "@bonus-tracker/ui";
import { LoadingSpinner } from "../../../components/loading-spinner";
import {
  subscribeToPushAction,
  unsubscribeFromPushAction,
  hasPushSubscriptionForEndpoint,
} from "../../../actions/push";

type PushToggleProps = {
  vapidPublicKey: string | null;
};

type SupportState = "unknown" | "unsupported" | "supported";

async function getActiveRegistration(): Promise<ServiceWorkerRegistration | null> {
  const existing = await navigator.serviceWorker.getRegistration();
  if (!existing) {
    return null;
  }
  return navigator.serviceWorker.ready;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const output = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; i += 1) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

export function PushToggle({ vapidPublicKey }: PushToggleProps) {
  const [supportState, setSupportState] = useState<SupportState>("unknown");
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setSupportState("unsupported");
      return;
    }

    setSupportState("supported");
    setPermission(Notification.permission);

    let cancelled = false;

    const detectExistingSubscription = async () => {
      try {
        const registration = await getActiveRegistration();
        if (!registration) {
          if (!cancelled) {
            setIsSubscribed(false);
          }
          return;
        }
        const subscription = await registration.pushManager.getSubscription();
        if (cancelled) {
          return;
        }
        if (!subscription) {
          setIsSubscribed(false);
          return;
        }
        const exists = await hasPushSubscriptionForEndpoint(subscription.endpoint);
        if (!cancelled) {
          setIsSubscribed(exists);
        }
      } catch {
        if (!cancelled) {
          setIsSubscribed(false);
        }
      }
    };

    void detectExistingSubscription();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleEnable = async () => {
    if (!vapidPublicKey) {
      setError("Push-сповіщення не налаштовані на сервері.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") {
        throw new Error("Дозвіл на сповіщення не надано.");
      }

      const registration = await getActiveRegistration();
      if (!registration) {
        throw new Error(
          "Сервіс-воркер не зареєстровано. У режимі розробки push вимкнено — запустіть продакшн-збірку (build + start)."
        );
      }
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      }

      const json = subscription.toJSON();
      await subscribeToPushAction({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: json.keys?.p256dh ?? "",
          auth: json.keys?.auth ?? "",
        },
      });

      setIsSubscribed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося увімкнути сповіщення.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const registration = await getActiveRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await unsubscribeFromPushAction(subscription.endpoint);
          await subscription.unsubscribe();
        }
      }
      setIsSubscribed(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося вимкнути сповіщення.");
    } finally {
      setIsLoading(false);
    }
  };

  if (supportState === "unknown") {
    return null;
  }

  if (supportState === "unsupported") {
    return (
      <p className="text-sm text-gray-600">
        Браузер не підтримує push-сповіщення. На iPhone додайте додаток на головний екран і відкрийте його звідти.
      </p>
    );
  }

  if (!vapidPublicKey) {
    return (
      <p className="text-sm text-amber-700">
        Push-сповіщення вимкнено: сервер не налаштовано (відсутній VAPID-ключ).
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Отримуйте сповіщення на цей пристрій, коли користувач створює запит на нарахування очок.
      </p>

      {permission === "denied" ? (
        <p className="text-sm text-destructive">
          Сповіщення заблоковані у налаштуваннях браузера. Дозвольте їх для цього сайту, а потім спробуйте знову.
        </p>
      ) : null}

      {isSubscribed ? (
        <Button
          type="button"
          variant="outline"
          onClick={handleDisable}
          disabled={isLoading}
          data-testid="push-disable-button"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Вимкнення...
            </>
          ) : (
            <>
              <BellOff className="h-4 w-4" />
              Вимкнути сповіщення
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleEnable}
          disabled={isLoading || permission === "denied"}
          className="gap-2 text-white"
          style={{ backgroundImage: "linear-gradient(90deg, #facc15 0%, #fb923c 100%)" }}
          data-testid="push-enable-button"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Підключення...
            </>
          ) : (
            <>
              <Bell className="h-4 w-4" />
              Увімкнути сповіщення
            </>
          )}
        </Button>
      )}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
