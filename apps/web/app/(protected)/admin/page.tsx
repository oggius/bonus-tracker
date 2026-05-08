import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "../../../lib/auth";
import { Button } from "@bonus-tracker/ui";

export default async function AdminPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/");
  }

  if (currentUser.role !== "ADMIN") {
    redirect("/user");
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Управління нагородами</h3>
          <Link href="/admin/rewards/create">
            <Button data-testid="create-reward-button">
              Додати нагороду
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Керуйте доступними нагородами та їх вартістю в очках.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Управління очками</h3>
        <p className="text-sm text-muted-foreground">
          У наступних задачах тут з'являться функції нарахування та списання очок.
        </p>
      </div>
    </section>
  );
}
