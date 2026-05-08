import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Button, Card } from "@bonus-tracker/ui";

import { logoutAction } from "../actions/auth";
import { getCurrentUser, getRoleHomePath } from "../../lib/auth";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/");
  }

  if (currentUser.role === "USER") {
    return <div className="min-h-screen bg-[#f3f4f6]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between py-4">
          <div>
            <p className="text-sm text-muted-foreground">BonusTracker</p>
            <h1 className="text-lg font-semibold">{currentUser.name}</h1>
            <p className="text-xs text-muted-foreground">Роль: {currentUser.role}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={getRoleHomePath(currentUser.role)}>
              <Button variant="outline" size="sm">Головна</Button>
            </Link>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="sm">Вийти</Button>
            </form>
          </div>
        </div>
      </header>
      <main className="container py-8">
        <Card className="p-6">{children}</Card>
      </main>
    </div>
  );
}
