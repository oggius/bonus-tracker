"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gift, ListChecks, LogOut, Settings, ShieldCheck } from "lucide-react";

import { logoutAction } from "../../actions/auth";

const ACTIVE_ITEM_CLASS = "bg-gray-100 text-gray-900";
const INACTIVE_ITEM_CLASS = "text-gray-500";

export function AdminBottomNav() {
  const pathname = usePathname();

  const isDashboard = pathname === "/admin";
  const isRewards = pathname.startsWith("/admin/rewards");
  const isPoints = pathname.startsWith("/admin/points");
  const isConfig = pathname === "/admin/rewards/create";

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
      <div className="mx-auto grid w-full max-w-3xl grid-cols-5 gap-2 px-3 py-2">
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
          <ListChecks className="h-5 w-5" />
          Операції
        </Link>

        <Link
          href="/admin/rewards/create"
          className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs transition ${
            isConfig ? ACTIVE_ITEM_CLASS : INACTIVE_ITEM_CLASS
          }`}
        >
          <Settings className="h-5 w-5" />
          Конфіг
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
