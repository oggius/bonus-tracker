"use client";

import { useEffect, useRef, useState } from "react";

import { Button, Input, Label } from "@bonus-tracker/ui";

import { loginAction } from "./actions/auth";

const SAVED_PASSWORD_STORAGE_KEY = "bonus_tracker_saved_password";
const PENDING_PASSWORD_SESSION_KEY = "bonus_tracker_pending_password";

type PasswordLoginFormProps = {
  hasInvalidCredentialsError: boolean;
};

export function PasswordLoginForm({ hasInvalidCredentialsError }: PasswordLoginFormProps) {
  const [password, setPassword] = useState("");
  const [rememberOnDevice, setRememberOnDevice] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (hasInvalidCredentialsError) {
      localStorage.removeItem(SAVED_PASSWORD_STORAGE_KEY);
      return;
    }

    const savedPassword = localStorage.getItem(SAVED_PASSWORD_STORAGE_KEY) ?? "";
    if (!savedPassword.trim()) {
      return;
    }

    setPassword(savedPassword);
  }, [hasInvalidCredentialsError]);

  return (
    <form
      ref={formRef}
      action={loginAction}
      className="space-y-4"
      onSubmit={() => {
        // Store password in sessionStorage as "pending". Only the USER page
        // promotes it to localStorage on mount; the admin page ignores it.
        if (rememberOnDevice && password.trim()) {
          sessionStorage.setItem(PENDING_PASSWORD_SESSION_KEY, password);
        } else {
          sessionStorage.removeItem(PENDING_PASSWORD_SESSION_KEY);
          localStorage.removeItem(SAVED_PASSWORD_STORAGE_KEY);
        }
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="password" className="text-base font-medium text-gray-700">
          Пароль
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Введіть пароль"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-14 rounded-xl border border-gray-200 bg-gray-50 text-lg"
          data-testid="password-input"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={rememberOnDevice}
          onChange={(event) => setRememberOnDevice(event.target.checked)}
        />
        Запам'ятати пароль на цьому пристрої
      </label>

      {hasInvalidCredentialsError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Невірний пароль. Спробуйте ще раз.
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
