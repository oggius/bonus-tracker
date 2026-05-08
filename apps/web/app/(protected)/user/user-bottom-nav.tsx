"use client";

import { History, LogOut, ShoppingBag, Star } from "lucide-react";
import { logoutAction } from "../../actions/auth";
import { type UserScreen } from "./exchange-utils";

const SAVED_PIN_STORAGE_KEY = "bonus_tracker_saved_pin";

type UserBottomNavProps = {
  activeScreen: UserScreen;
  onScreenChange: (screen: UserScreen) => void;
};

export function UserBottomNav({ activeScreen, onScreenChange }: UserBottomNavProps) {
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
      <div className="mx-auto grid w-full max-w-3xl grid-cols-4 gap-2 px-3 py-2">
        <button
          type="button"
          onClick={() => onScreenChange("balance")}
          data-testid="user-nav-balance"
          className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs transition ${
            activeScreen === "balance"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-500"
          }`}
        >
          <Star className="h-5 w-5" />
          Баланс
        </button>
        <button
          type="button"
          onClick={() => onScreenChange("shop")}
          data-testid="user-nav-shop"
          className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs transition ${
            activeScreen === "shop" ? "bg-gray-100 text-gray-900" : "text-gray-500"
          }`}
        >
          <ShoppingBag className="h-5 w-5" />
          Магазин
        </button>
        <button
          type="button"
          onClick={() => onScreenChange("history")}
          data-testid="user-nav-history"
          className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs transition ${
            activeScreen === "history"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-500"
          }`}
        >
          <History className="h-5 w-5" />
          Історія
        </button>
        <form
          action={logoutAction}
          className="w-full"
          onSubmit={() => {
            localStorage.removeItem(SAVED_PIN_STORAGE_KEY);
          }}
        >
          <button
            type="submit"
            data-testid="user-nav-logout"
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
