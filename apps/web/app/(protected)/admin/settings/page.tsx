import { redirect } from "next/navigation";
import { Bell, KeyRound, Lock } from "lucide-react";

import { Card } from "@bonus-tracker/ui";
import { requireAdminUser } from "../../../../lib/auth";
import { db } from "../../../../lib/db";
import { AdminPasswordForm, UserPasswordForm } from "./settings-forms";
import { PushToggle } from "./push-toggle";

export default async function AdminSettingsPage() {
  const currentUser = await requireAdminUser({ allowMustChangePassword: true });

  const userAccount = await db.user.findFirst({
    where: { role: "USER" },
    select: {
      id: true,
      name: true,
    },
  });

  if (!userAccount) {
    redirect("/admin");
  }

  return (
    <section className="space-y-6">
      <Card className="rounded-[30px] border border-gray-200 bg-white px-6 py-8 shadow-lg">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-slate-50 p-3">
            <Lock className="h-8 w-8 text-slate-700" />
          </div>
          <h2 className="text-4xl font-semibold text-gray-900">Безпека</h2>
          <p className="mt-2 text-lg text-gray-600">Оновлення паролів адміністратора та користувача.</p>
        </div>
      </Card>

      <Card className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">
          <KeyRound className="h-4 w-4" />
          Адміністратор
        </div>
        <AdminPasswordForm mustChangePassword={currentUser.mustChangePassword} />
      </Card>

      <Card className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
          <KeyRound className="h-4 w-4" />
          Користувач
        </div>
        <UserPasswordForm userId={userAccount.id} userName={userAccount.name} />
      </Card>

      <Card className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
          <Bell className="h-4 w-4" />
          Сповіщення
        </div>
        <PushToggle vapidPublicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null} />
      </Card>
    </section>
  );
}
