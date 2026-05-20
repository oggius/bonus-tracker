import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getCurrentUser } from "../../lib/auth";
import { db } from "../../lib/db";
import { AdminBottomNav } from "./admin/admin-bottom-nav";

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

  const pendingRequestsCount = await db.pointsLog.count({
    where: {
      status: "PENDING",
      initiatedBy: "USER",
    },
  });

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-6 md:px-6">
        {children}
      </main>
      <AdminBottomNav pendingRequestsCount={pendingRequestsCount} />
    </div>
  );
}
