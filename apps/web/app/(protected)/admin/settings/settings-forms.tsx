"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button, Input, Label } from "@bonus-tracker/ui";
import {
  changeAdminPasswordAction,
  setUserPasswordAction,
} from "../../../actions/password";
import { LoadingSpinner } from "../../../components/loading-spinner";

type AdminPasswordFormProps = {
  mustChangePassword: boolean;
};

export function AdminPasswordForm({ mustChangePassword }: AdminPasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await changeAdminPasswordAction(formData);
      setIsLoading(false);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Сталася помилка");
      setIsLoading(false);
    }
  };

  return (
    <form
      action={handleSubmit}
      className={`loading-section space-y-4 ${isLoading ? "loading-section--busy" : ""}`}
    >
      {mustChangePassword ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Для безпеки потрібно змінити стандартний пароль адміністратора.
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="currentPassword">Поточний пароль</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          disabled={isLoading}
          data-testid="admin-current-password-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">Новий пароль</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          disabled={isLoading}
          data-testid="admin-new-password-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Підтвердіть новий пароль</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          disabled={isLoading}
          data-testid="admin-confirm-password-input"
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button
        type="submit"
        disabled={isLoading}
        className="text-white"
        data-testid="admin-password-submit-button"
        style={{ backgroundImage: "linear-gradient(90deg, #facc15 0%, #fb923c 100%)" }}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            Збереження...
          </>
        ) : (
          "Оновити пароль адміністратора"
        )}
      </Button>
    </form>
  );
}

type UserPasswordFormProps = {
  userId: string;
  userName: string;
};

export function UserPasswordForm({ userId, userName }: UserPasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await setUserPasswordAction(formData);
      setIsLoading(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Сталася помилка");
      setIsLoading(false);
    }
  };

  return (
    <form
      action={handleSubmit}
      className={`loading-section space-y-4 ${isLoading ? "loading-section--busy" : ""}`}
    >
      <input type="hidden" name="userId" value={userId} />

      <p className="text-sm text-gray-600">
        Ця форма оновлює пароль для користувача: <span className="font-semibold">{userName}</span>
      </p>

      <div className="space-y-2">
        <Label htmlFor="userNewPassword">Новий пароль користувача</Label>
        <Input
          id="userNewPassword"
          name="newPassword"
          type="password"
          required
          disabled={isLoading}
          data-testid="user-new-password-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="userConfirmPassword">Підтвердіть новий пароль</Label>
        <Input
          id="userConfirmPassword"
          name="confirmPassword"
          type="password"
          required
          disabled={isLoading}
          data-testid="user-confirm-password-input"
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button
        type="submit"
        disabled={isLoading}
        variant="outline"
        data-testid="user-password-submit-button"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            Збереження...
          </>
        ) : (
          "Оновити пароль користувача"
        )}
      </Button>
    </form>
  );
}
