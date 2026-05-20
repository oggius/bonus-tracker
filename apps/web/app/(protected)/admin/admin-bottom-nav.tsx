"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Gift, ListChecks, LogOut, Settings, ShieldCheck } from "lucide-react";

import { logoutAction } from "../../actions/auth";

const ACTIVE_ITEM_CLASS = "bg-gray-100 text-gray-900";
const INACTIVE_ITEM_CLASS = "text-gray-500";

type AdminBottomNavProps = {
  pendingRequestsCount?: number;
};

export function AdminBottomNav({ pendingRequestsCount = 0 }: AdminBottomNavProps) {
  const pathname = usePathname();

  const isDashboard = pathname === "/admin";
  const isActivities = pathname.startsWith("/admin/activities");
  const isRewards = pathname.startsWith("/admin/rewards");
  const isPoints = pathname.startsWith("/admin/points");
  const isSettings = pathname.startsWith("/admin/settings");
  const badgeLabel = pendingRequestsCount > 99 ? "99+" : String(pendingRequestsCount);

  return (
    <nav
      className="z-20 border-t border-gray-200 bg-white/95 backdrop-blur"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div className="mx-auto grid w-full max-w-3xl grid-cols-6 gap-2 px-3 py-2">
        <Link
          href="/admin"
          className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs transition ${
            isDashboard ? ACTIVE_ITEM_CLASS : INACTIVE_ITEM_CLASS
          }`}
        >
          <ShieldCheck className="h-5 w-5" />
          Панель
        </Link>

        <Link
          href="/admin/activities"
          data-testid="admin-nav-activities"
          className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs transition ${
            isActivities ? ACTIVE_ITEM_CLASS : INACTIVE_ITEM_CLASS
          }`}
        >
          <Activity className="h-5 w-5" />
          Активності
        </Link>

        <Link
          href="/admin/rewards"
          className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs transition ${
            isRewards ? ACTIVE_ITEM_CLASS : INACTIVE_ITEM_CLASS
          }`}
        >
          <Gift className="h-5 w-5" />
          Нагороди
        </Link>

        <Link
          href="/admin/points"
          className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs transition ${
            isPoints ? ACTIVE_ITEM_CLASS : INACTIVE_ITEM_CLASS
          }`}
        >
          <span className="relative inline-flex">
            <ListChecks className="h-5 w-5" />
            {pendingRequestsCount > 0 ? (
              <span
                className="absolute -right-2 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white"
                data-testid="admin-nav-pending-badge"
              >
                {badgeLabel}
              </span>
            ) : null}
          </span>
          Операції
        </Link>

        <Link
          href="/admin/settings"
          data-testid="admin-nav-settings"
          className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs transition ${
            isSettings ? ACTIVE_ITEM_CLASS : INACTIVE_ITEM_CLASS
          }`}
        >
          <Settings className="h-5 w-5" />
          Безпека
        </Link>

        <form action={logoutAction} className="w-full">
          <button
            type="submit"
            className="flex w-full flex-col items-center rounded-xl px-2 py-2 text-xs text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5" />
            Вийти
          </button>
        </form>
      </div>
    </nav>
  );
}
