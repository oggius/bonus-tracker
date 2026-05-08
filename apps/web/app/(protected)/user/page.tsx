import { redirect } from "next/navigation";

import { getCurrentUser } from "../../../lib/auth";

export default async function UserPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/");
  }

  if (currentUser.role !== "USER") {
    redirect("/admin");
  }

  return (
    <section className="space-y-2">
      <h2 className="text-2xl font-semibold">User Dashboard</h2>
      <p className="text-muted-foreground">
        Це початкова користувацька поверхня. У наступних задачах тут з'являться
        баланс, історія та обмін нагород.
      </p>
    </section>
  );
}
