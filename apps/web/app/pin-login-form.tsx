"use client";

import { useEffect, useRef, useState } from "react";

import { Button, Input, Label } from "@bonus-tracker/ui";

import { loginWithPinAction } from "./actions/auth";

const SAVED_PIN_STORAGE_KEY = "bonus_tracker_saved_pin";
const PENDING_PIN_SESSION_KEY = "bonus_tracker_pending_pin";

type PinLoginFormProps = {
  hasInvalidPinError: boolean;
};

export function PinLoginForm({ hasInvalidPinError }: PinLoginFormProps) {
  const [pin, setPin] = useState("");
  const [rememberOnDevice, setRememberOnDevice] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const didAutoSubmitRef = useRef(false);

  useEffect(() => {
    if (hasInvalidPinError) {
      localStorage.removeItem(SAVED_PIN_STORAGE_KEY);
      return;
    }

    const savedPin = localStorage.getItem(SAVED_PIN_STORAGE_KEY) ?? "";
    if (!/^\d{4}$/.test(savedPin)) {
      return;
    }

    setPin(savedPin);
  }, [hasInvalidPinError]);

  useEffect(() => {
    if (didAutoSubmitRef.current || hasInvalidPinError || pin.length !== 4) {
      return;
    }

    didAutoSubmitRef.current = true;
    formRef.current?.requestSubmit();
  }, [hasInvalidPinError, pin]);

  return (
    <form
      ref={formRef}
      action={loginWithPinAction}
      className="space-y-4"
      onSubmit={() => {
        // Store PIN in sessionStorage as "pending". Only the USER page
        // promotes it to localStorage on mount; the admin page ignores it.
        if (rememberOnDevice && /^\d{4}$/.test(pin)) {
          sessionStorage.setItem(PENDING_PIN_SESSION_KEY, pin);
        } else {
          sessionStorage.removeItem(PENDING_PIN_SESSION_KEY);
          localStorage.removeItem(SAVED_PIN_STORAGE_KEY);
        }
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="pin" className="text-base font-medium text-gray-700">
          PIN
        </Label>
        <Input
          id="pin"
          name="pin"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          placeholder="••••"
          autoComplete="off"
          required
          value={pin}
          onChange={(event) => {
            const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 4);
            setPin(digitsOnly);
          }}
          className="h-14 rounded-xl border border-gray-200 bg-gray-50 text-center text-3xl tracking-[0.3em]"
          data-testid="pin-input"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={rememberOnDevice}
          onChange={(event) => setRememberOnDevice(event.target.checked)}
        />
        Запам'ятати PIN на цьому пристрої
      </label>

      {hasInvalidPinError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Невірний PIN. Спробуйте ще раз.
        </p>
      ) : null}

      <Button
        type="submit"
        className="h-14 w-full rounded-2xl text-lg font-semibold text-white"
        style={{ backgroundImage: "linear-gradient(90deg, #facc15 0%, #fb923c 100%)" }}
        data-testid="login-button"
      >
        Увійти
      </Button>
    </form>
  );
}
