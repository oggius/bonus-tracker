/**
 * Daily todo utility functions for state management, formatting, and reset logic
 */

export const REQUIRED_ACTIONS = [
  "Покупатись",
  "Нанести антиперспірант",
  "Почистити зубки",
  "Застелити ліжко",
  "Одягтись в шкільний або домашній одяг",
];

export const MOTIVATIONAL_TOASTS = [
  "Молодець, так тримати!",
  "Чудово!",
  "Супер, те що треба!",
  "Продовжуй в тому ж дусі!",
];

const UKRAINIAN_WEEKDAYS = [
  "неділя",
  "понеділок",
  "вівторок",
  "середа",
  "четвер",
  "пʼятниця",
  "субота",
];

const UKRAINIAN_MONTHS = [
  "січня",
  "лютого",
  "березня",
  "квітня",
  "травня",
  "червня",
  "липня",
  "серпня",
  "вересня",
  "жовтня",
  "листопада",
  "грудня",
];

/**
 * Get today's date in YYYY-MM-DD format (local timezone)
 */
export function getTodayDateString(): string {
  return new Date().toLocaleDateString("sv-SE"); // sv-SE gives YYYY-MM-DD format
}

/**
 * Format date header: "Справи на сьогодні (weekday, dd month)"
 * Example: "Справи на сьогодні (понеділок, 10 травня)"
 */
export function formatTodayHeader(): string {
  const now = new Date();
  const weekday = UKRAINIAN_WEEKDAYS[now.getDay()];
  const day = now.getDate();
  const month = UKRAINIAN_MONTHS[now.getMonth()];
  return `Справи на сьогодні (${weekday}, ${day} ${month})`;
}

/**
 * Get random motivational toast text
 */
export function getRandomMotivationalToast(): string {
  return MOTIVATIONAL_TOASTS[Math.floor(Math.random() * MOTIVATIONAL_TOASTS.length)];
}

export type AdditionalAction = {
  id: string;
  text: string;
  checked: boolean;
};

export type DailyTodoState = {
  lastResetDate: string; // YYYY-MM-DD in local timezone
  checkedRequired: Set<string>; // Set of indices (0-4) that are checked
  additionalActions: AdditionalAction[];
  shownPopups: {
    allRequiredDone: boolean; // Shown when all required are done but additional incomplete/empty
    allAdditionalDone: boolean; // Shown when all additional are done but required incomplete
    allCompleted: boolean; // Shown when all required and additional are done
  };
  sentCompletion: boolean; // Whether point request was sent for today
};

/**
 * Create a fresh state for a new day
 */
export function createFreshState(dateString?: string): DailyTodoState {
  return {
    lastResetDate: dateString || getTodayDateString(),
    checkedRequired: new Set(),
    additionalActions: [],
    shownPopups: {
      allRequiredDone: false,
      allAdditionalDone: false,
      allCompleted: false,
    },
    sentCompletion: false,
  };
}

/**
 * Serialize state for localStorage (convert Set to array)
 */
export function serializeState(state: DailyTodoState): string {
  return JSON.stringify({
    ...state,
    checkedRequired: Array.from(state.checkedRequired),
  });
}

/**
 * Deserialize state from localStorage (convert array to Set)
 */
export function deserializeState(json: string): DailyTodoState {
  const parsed = JSON.parse(json);
  return {
    ...parsed,
    checkedRequired: new Set(parsed.checkedRequired),
  };
}

/**
 * Generate unique ID for additional actions
 */
export function generateActionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
