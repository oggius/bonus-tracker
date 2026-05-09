import { Film, IceCream, Star, Ticket, Wallet, Youtube } from "lucide-react";

export type RewardItem = {
  id: string;
  name: string;
  description: string | null;
  cost: number;
};

export type ExchangeItem = {
  id: string;
  rewardName: string;
  costSnapshot: number;
  comment: string | null;
};

export type HistoryItem = {
  id: string;
  createdAt: string;
  description: string;
  delta: number;
  type: "POINTS" | "EXCHANGE";
};

export type PendingPointsRequestItem = {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
};

export type UserScreen = "balance" | "add" | "shop" | "history";

export const SHOP_CARD_STYLES = [
  {
    gradient: "linear-gradient(90deg, #fee2e2 0%, #fecaca 100%)",
    borderColor: "#fca5a5",
    icon: "text-red-500",
    text: "text-red-900",
    Icon: Youtube,
  },
  {
    gradient: "linear-gradient(90deg, #d1fae5 0%, #a7f3d0 100%)",
    borderColor: "#6ee7b7",
    icon: "text-emerald-500",
    text: "text-emerald-900",
    Icon: Wallet,
  },
  {
    gradient: "linear-gradient(90deg, #fce7f3 0%, #fbcfe8 100%)",
    borderColor: "#f9a8d4",
    icon: "text-pink-500",
    text: "text-pink-900",
    Icon: IceCream,
  },
  {
    gradient: "linear-gradient(90deg, #ede9fe 0%, #ddd6fe 100%)",
    borderColor: "#c4b5fd",
    icon: "text-violet-500",
    text: "text-violet-900",
    Icon: Film,
  },
  {
    gradient: "linear-gradient(90deg, #dbeafe 0%, #bfdbfe 100%)",
    borderColor: "#93c5fd",
    icon: "text-blue-500",
    text: "text-blue-900",
    Icon: Ticket,
  },
] as const;

export function getHistoryVisual(entry: HistoryItem) {
  const descriptionLower = entry.description.toLowerCase();

  if (entry.type === "POINTS") {
    return { Icon: Star, iconClass: "text-yellow-400", iconBgClass: "bg-emerald-100" };
  }

  if (descriptionLower.includes("youtube")) {
    return { Icon: Youtube, iconClass: "text-red-500", iconBgClass: "bg-red-100" };
  }

  if (descriptionLower.includes("кишеньков")) {
    return { Icon: Wallet, iconClass: "text-emerald-500", iconBgClass: "bg-emerald-100" };
  }

  if (descriptionLower.includes("морозив")) {
    return { Icon: IceCream, iconClass: "text-pink-500", iconBgClass: "bg-pink-100" };
  }

  if (descriptionLower.includes("кіно")) {
    return { Icon: Film, iconClass: "text-violet-500", iconBgClass: "bg-violet-100" };
  }

  return { Icon: Ticket, iconClass: "text-blue-500", iconBgClass: "bg-blue-100" };
}

export function formatHistoryDate(createdAtISO: string) {
  return new Date(createdAtISO).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPointsLabel(points: number) {
  const mod10 = points % 10;
  const mod100 = points % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${points} очко`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${points} очки`;
  }

  return `${points} очок`;
}
