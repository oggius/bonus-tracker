"use client";

import { useState, useCallback, useEffect } from "react";
import {
  DailyTodoState,
  AdditionalAction,
  createFreshState,
  getTodayDateString,
  serializeState,
  deserializeState,
  generateActionId,
  REQUIRED_ACTIONS,
} from "./daily-todo-utils";

const TODO_STATE_KEY = "bonus_tracker_daily_todo_state";

/**
 * Custom hook for managing daily todo state with lazy reset logic
 * Reset happens when the stored date differs from today's date on initialization
 */
export function useDailyTodoState() {
  const [state, setState] = useState<DailyTodoState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize state on mount (lazy reset logic)
  useEffect(() => {
    const today = getTodayDateString();
    const stored = localStorage.getItem(TODO_STATE_KEY);

    let initialState: DailyTodoState;

    if (stored) {
      try {
        const parsed = deserializeState(stored);
        if (parsed.lastResetDate !== today) {
          // New day detected → reset
          initialState = createFreshState(today);
        } else {
          // Same day → use existing
          initialState = parsed;
        }
      } catch {
        // Corrupted storage → create fresh
        initialState = createFreshState(today);
      }
    } else {
      // First load → create fresh
      initialState = createFreshState(today);
    }

    setState(initialState);
    setIsInitialized(true);
  }, []);

  // Persist state to localStorage on every change
  const updateState = useCallback((newState: DailyTodoState) => {
    setState(newState);
    localStorage.setItem(TODO_STATE_KEY, serializeState(newState));
  }, []);

  // Toggle required action checkbox
  const toggleRequired = useCallback(
    (index: number) => {
      if (!state) return;

      const newChecked = new Set(state.checkedRequired);
      if (newChecked.has(String(index))) {
        newChecked.delete(String(index));
      } else {
        newChecked.add(String(index));
      }

      updateState({
        ...state,
        checkedRequired: newChecked,
      });
    },
    [state, updateState]
  );

  // Check if required action is checked
  const isRequiredChecked = useCallback(
    (index: number) => {
      return state?.checkedRequired.has(String(index)) ?? false;
    },
    [state]
  );

  // All required actions checked?
  const areAllRequiredDone = useCallback(() => {
    if (!state) return false;
    const totalRequired = REQUIRED_ACTIONS.length;
    return state.checkedRequired.size === totalRequired;
  }, [state]);

  // All additional actions checked?
  const areAllAdditionalDone = useCallback(() => {
    if (!state) return false;
    if (state.additionalActions.length === 0) return false;
    return state.additionalActions.every((action) => action.checked);
  }, [state]);

  // Add additional action
  const addAdditional = useCallback(
    (text: string) => {
      if (!state) return;

      const newAction: AdditionalAction = {
        id: generateActionId(),
        text,
        checked: false,
      };

      updateState({
        ...state,
        additionalActions: [...state.additionalActions, newAction],
      });

      return newAction.id;
    },
    [state, updateState]
  );

  // Remove additional action
  const removeAdditional = useCallback(
    (id: string) => {
      if (!state) return;

      updateState({
        ...state,
        additionalActions: state.additionalActions.filter((action) => action.id !== id),
      });
    },
    [state, updateState]
  );

  // Toggle additional action checkbox
  const toggleAdditional = useCallback(
    (id: string) => {
      if (!state) return;

      const newAdditional = state.additionalActions.map((action) =>
        action.id === id ? { ...action, checked: !action.checked } : action
      );

      updateState({
        ...state,
        additionalActions: newAdditional,
      });
    },
    [state, updateState]
  );

  // Edit additional action text
  const editAdditional = useCallback(
    (id: string, newText: string) => {
      if (!state) return;

      const newAdditional = state.additionalActions.map((action) =>
        action.id === id ? { ...action, text: newText } : action
      );

      updateState({
        ...state,
        additionalActions: newAdditional,
      });
    },
    [state, updateState]
  );

  // Mark popup as shown
  const markPopupShown = useCallback(
    (popup: "allRequiredDone" | "allAdditionalDone" | "allCompleted") => {
      if (!state) return;

      updateState({
        ...state,
        shownPopups: {
          ...state.shownPopups,
          [popup]: true,
        },
      });
    },
    [state, updateState]
  );

  // Mark completion point request as sent
  const markCompletionSent = useCallback(() => {
    if (!state) return;

    updateState({
      ...state,
      sentCompletion: true,
    });
  }, [state, updateState]);

  return {
    state,
    isInitialized,
    toggleRequired,
    isRequiredChecked,
    areAllRequiredDone,
    areAllAdditionalDone,
    addAdditional,
    removeAdditional,
    toggleAdditional,
    editAdditional,
    markPopupShown,
    markCompletionSent,
  };
}
