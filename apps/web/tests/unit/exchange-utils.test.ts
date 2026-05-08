import { describe, expect, it } from "vitest";

import {
  formatHistoryDate,
  formatPointsLabel,
  getHistoryVisual,
  type HistoryItem,
} from "../../app/(protected)/user/exchange-utils";

const baseHistory = {
  id: "entry-1",
  createdAt: "2026-05-08T12:34:00.000Z",
  delta: -1,
} as const;

describe("exchange utils", () => {
  describe("formatPointsLabel", () => {
    it("handles singular form", () => {
      expect(formatPointsLabel(1)).toBe("1 очко");
      expect(formatPointsLabel(21)).toBe("21 очко");
    });

    it("handles paucal form", () => {
      expect(formatPointsLabel(2)).toBe("2 очки");
      expect(formatPointsLabel(4)).toBe("4 очки");
      expect(formatPointsLabel(22)).toBe("22 очки");
    });

    it("handles plural form", () => {
      expect(formatPointsLabel(0)).toBe("0 очок");
      expect(formatPointsLabel(5)).toBe("5 очок");
      expect(formatPointsLabel(11)).toBe("11 очок");
      expect(formatPointsLabel(14)).toBe("14 очок");
    });
  });

  describe("getHistoryVisual", () => {
    it("uses points visual for POINTS entries", () => {
      const entry: HistoryItem = {
        ...baseHistory,
        description: "Нарахування за допомогу",
        type: "POINTS",
      };

      const visual = getHistoryVisual(entry);
      expect(visual.iconClass).toBe("text-yellow-400");
      expect(visual.iconBgClass).toBe("bg-emerald-100");
    });

    it("uses youtube visual by keyword", () => {
      const entry: HistoryItem = {
        ...baseHistory,
        description: "Обмін на YouTube premium",
        type: "EXCHANGE",
      };

      const visual = getHistoryVisual(entry);
      expect(visual.iconClass).toBe("text-red-500");
      expect(visual.iconBgClass).toBe("bg-red-100");
    });

    it("falls back to default exchange visual", () => {
      const entry: HistoryItem = {
        ...baseHistory,
        description: "Обмін на сюрприз",
        type: "EXCHANGE",
      };

      const visual = getHistoryVisual(entry);
      expect(visual.iconClass).toBe("text-blue-500");
      expect(visual.iconBgClass).toBe("bg-blue-100");
    });
  });

  describe("formatHistoryDate", () => {
    it("returns localized date-time string", () => {
      const result = formatHistoryDate("2026-05-08T12:34:00.000Z");

      expect(result).toMatch(/\d{1,2}.*\d{2}:\d{2}/);
    });
  });
});
