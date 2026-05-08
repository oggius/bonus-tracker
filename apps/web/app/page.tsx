import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Button } from "@bonus-tracker/ui";

import { loginWithPinAction, logoutAction } from "./actions/auth";
import { getCurrentUser } from "../lib/auth";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentUser = await getCurrentUser();
  const hasInvalidPinError = params.error === "invalid_pin";

  if (currentUser) {
    return (
      <main className="container py-12">
        <Card className="mx-auto max-w-xl p-8 shadow-sm">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-3xl">Вітаємо, {currentUser.name}</CardTitle>
            <CardDescription className="mt-3 leading-relaxed">
              Сесію успішно створено. Поточна роль: <strong>{currentUser.role}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <form action={logoutAction}>
              <Button type="submit" variant="outline">Вийти</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container py-12">
      <Card className="mx-auto max-w-xl p-8 shadow-sm">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-3xl">BonusTracker</CardTitle>
          <CardDescription className="mt-3 leading-relaxed">
            Введіть 4-значний PIN для входу у застосунок.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-0 pb-0">
          <form action={loginWithPinAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                name="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="••••"
                autoComplete="off"
                required
              />
            </div>
            {hasInvalidPinError ? (
              <p className="text-sm text-destructive">Невірний PIN. Спробуйте ще раз.</p>
            ) : null}
            <Button type="submit" className="w-full">Увійти</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
