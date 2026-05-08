import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bonus-tracker/ui";
import { redirect } from "next/navigation";

import { getCurrentUser, getRoleHomePath } from "../lib/auth";
import { PinLoginForm } from "./pin-login-form";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentUser = await getCurrentUser();
  const hasInvalidPinError = params.error === "invalid_pin";

  if (currentUser) {
    redirect(getRoleHomePath(currentUser.role));
  }

  return (
    <main className="min-h-screen bg-[#f3f4f6] px-4 py-6">
      <section className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-xl items-center justify-center">
        <Card className="w-full rounded-[30px] border border-gray-200 bg-white p-6 shadow-lg md:p-8">
          <CardHeader className="px-0 pt-0 text-center">
            <CardTitle className="text-4xl font-semibold text-gray-900">BonusTracker</CardTitle>
            <CardDescription className="mt-3 text-lg leading-relaxed text-gray-600">
              Введіть 4-значний PIN для входу у застосунок.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 px-0 pb-0">
            <PinLoginForm hasInvalidPinError={hasInvalidPinError} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
