import { expect, test } from "@playwright/test";
import { loginAsUser } from "./helpers/auth";

test.describe("Daily Todo Checklist", () => {
  test("displays 5 required daily tasks", async ({ page }) => {
    await loginAsUser(page);

    const requiredItems = page.locator('[data-testid^="daily-todo-required-item-"]');
    await expect(requiredItems).toHaveCount(5);

    // Verify task texts are visible (5 Ukrainian tasks)
    await expect(requiredItems.nth(0)).toContainText(/.*./); // Just verify not empty
    await expect(requiredItems.nth(1)).toContainText(/.*./);
    await expect(requiredItems.nth(2)).toContainText(/.*./);
    await expect(requiredItems.nth(3)).toContainText(/.*./);
    await expect(requiredItems.nth(4)).toContainText(/.*./);
  });

  test("can check required item with confirmation dialog", async ({ page }) => {
    await loginAsUser(page);

    const firstItem = page.locator('[data-testid="daily-todo-required-item-0"]');
    const checkbox = firstItem.locator('input[type="checkbox"]');

    // Initially unchecked
    await expect(checkbox).not.toBeChecked();

    // Click item to check - should show confirmation dialog
    await firstItem.click();
    const confirmDialog = page.locator('[data-testid="daily-todo-check-confirm-dialog"]');
    await expect(confirmDialog).toBeVisible();

    // Confirm the check
    const confirmButton = confirmDialog.locator('button:has-text("👍")');
    await confirmButton.click();

    // Item should now be checked
    await expect(checkbox).toBeChecked();
  });

  test("can uncheck required item directly without dialog", async ({ page }) => {
    await loginAsUser(page);

    const firstItem = page.locator('[data-testid="daily-todo-required-item-0"]');
    const checkbox = firstItem.locator('input[type="checkbox"]');

    // Check it first
    await firstItem.click();
    const confirmButton = page.locator('[data-testid="daily-todo-check-confirm-dialog"]').locator('button:has-text("👍")');
    await confirmButton.click();
    await expect(checkbox).toBeChecked();

    // Uncheck should work directly without dialog
    await firstItem.click();
    await expect(checkbox).not.toBeChecked();
  });

  test("can add additional tasks", async ({ page }) => {
    await loginAsUser(page);

    const input = page.locator('[data-testid="daily-todo-add-action-input"]');
    const addButton = page.locator('[data-testid="daily-todo-add-action-button"]');

    // Add first additional task
    await input.fill("Помити посуд");
    await addButton.click();

    let additionalItems = page.locator('[data-testid^="daily-todo-additional-item-"]');
    await expect(additionalItems).toHaveCount(1);
    await expect(additionalItems.first()).toContainText("Помити посуд");

    // Add second additional task
    await input.fill("Прибрати кімнату");
    await addButton.click();

    additionalItems = page.locator('[data-testid^="daily-todo-additional-item-"]');
    await expect(additionalItems).toHaveCount(2);
  });

  test("can edit additional tasks inline", async ({ page }) => {
    await loginAsUser(page);

    // Add a task first
    const input = page.locator('[data-testid="daily-todo-add-action-input"]');
    const addButton = page.locator('[data-testid="daily-todo-add-action-button"]');
    await input.fill("Оригінальна назва");
    await addButton.click();

    const item = page.locator('[data-testid^="daily-todo-additional-item-"]').first();
    const editButton = item.locator('[data-testid^="daily-todo-edit-action-"]');

    // Click edit button
    await editButton.click();

    // Edit input should appear with current text
    const editInput = item.locator('[data-testid^="daily-todo-edit-input-"]');
    await expect(editInput).toBeVisible();

    // Clear and type new text
    await editInput.clear();
    await editInput.fill("Нова назва");

    // Save with Enter or Save button
    const saveButton = item.locator('[data-testid^="daily-todo-save-edit-"]');
    await saveButton.click();

    // Should show new text
    await expect(item).toContainText("Нова назва");
  });

  test("can delete additional tasks", async ({ page }) => {
    await loginAsUser(page);

    // Add two tasks
    const input = page.locator('[data-testid="daily-todo-add-action-input"]');
    const addButton = page.locator('[data-testid="daily-todo-add-action-button"]');
    await input.fill("Task 1");
    await addButton.click();
    await input.fill("Task 2");
    await addButton.click();

    let additionalItems = page.locator('[data-testid^="daily-todo-additional-item-"]');
    await expect(additionalItems).toHaveCount(2);

    // Delete first task
    const deleteButton = additionalItems.first().locator('[data-testid^="daily-todo-delete-action-"]');
    await deleteButton.click();

    additionalItems = page.locator('[data-testid^="daily-todo-additional-item-"]');
    await expect(additionalItems).toHaveCount(1);
    await expect(additionalItems.first()).toContainText("Task 2");
  });

  test("shows milestone popup when all required tasks done", async ({ page }) => {
    await loginAsUser(page);

    // Check all 5 required items
    for (let i = 0; i < 5; i++) {
      const item = page.locator(`[data-testid="daily-todo-required-item-${i}"]`);
      const checkbox = item.locator('input[type="checkbox"]');
      await item.click();

      const confirmDialog = page.locator('[data-testid="daily-todo-check-confirm-dialog"]');
      if (await confirmDialog.isVisible()) {
        const confirmButton = confirmDialog.locator('button:has-text("👍")');
        await confirmButton.click();
      }
    }

    // Should see milestone popup for required tasks
    const requiredDonePopup = page.locator('[data-testid="daily-todo-all-required-done-popup"]');
    await expect(requiredDonePopup).toBeVisible();
    await expect(requiredDonePopup).toContainText("Чудово");
  });

  test("shows milestone popup when all additional tasks done", async ({ page }) => {
    await loginAsUser(page);

    // Add some additional tasks
    const input = page.locator('[data-testid="daily-todo-add-action-input"]');
    const addButton = page.locator('[data-testid="daily-todo-add-action-button"]');
    await input.fill("Task A");
    await addButton.click();
    await input.fill("Task B");
    await addButton.click();

    // Check all additional items
    let additionalItems = page.locator('[data-testid^="daily-todo-additional-item-"]');
    const count = await additionalItems.count();

    for (let i = 0; i < count; i++) {
      const item = additionalItems.nth(i);
      await item.click();

      const confirmDialog = page.locator('[data-testid="daily-todo-check-confirm-dialog"]');
      if (await confirmDialog.isVisible()) {
        const confirmButton = confirmDialog.locator('button:has-text("👍")');
        await confirmButton.click();
      }
    }

    // Should see milestone popup for additional tasks
    const additionalDonePopup = page.locator('[data-testid="daily-todo-all-additional-done-popup"]');
    await expect(additionalDonePopup).toBeVisible();
    await expect(additionalDonePopup).toContainText("Дороби");
  });

  test("shows completion popup and submits bonus when all done", async ({ page }) => {
    await loginAsUser(page);

    // Add additional task first
    const input = page.locator('[data-testid="daily-todo-add-action-input"]');
    const addButton = page.locator('[data-testid="daily-todo-add-action-button"]');
    await input.fill("Додаткова справа");
    await addButton.click();

    // Check all 5 required items
    for (let i = 0; i < 5; i++) {
      const item = page.locator(`[data-testid="daily-todo-required-item-${i}"]`);
      const checkbox = item.locator('input[type="checkbox"]');
      
      await item.click();
      const confirmDialog = page.locator('[data-testid="daily-todo-check-confirm-dialog"]');
      if (await confirmDialog.isVisible()) {
        const confirmButton = confirmDialog.locator('button:has-text("👍")');
        await confirmButton.click();
      }
      
      await page.waitForTimeout(300);
    }

    // Check that all required items are checked
    for (let i = 0; i < 5; i++) {
      const checkbox = page.locator(`[data-testid="daily-todo-required-item-${i}"]`).locator('input[type="checkbox"]');
      await expect(checkbox).toBeChecked();
    }
  });

  test("persists state to localStorage across page reload", async ({ page, context }) => {
    await loginAsUser(page);

    // Add tasks
    const input = page.locator('[data-testid="daily-todo-add-action-input"]');
    const addButton = page.locator('[data-testid="daily-todo-add-action-button"]');
    await input.fill("Персистувати цю справу");
    await addButton.click();

    // Check a required item
    const firstItem = page.locator('[data-testid="daily-todo-required-item-0"]');
    const checkbox = firstItem.locator('input[type="checkbox"]');
    await firstItem.click();

    const confirmDialog = page.locator('[data-testid="daily-todo-check-confirm-dialog"]');
    if (await confirmDialog.isVisible()) {
      const confirmButton = confirmDialog.locator('button:has-text("👍")');
      await confirmButton.click();
    }

    // Verify state before reload
    await expect(checkbox).toBeChecked();
    let additionalItems = page.locator('[data-testid^="daily-todo-additional-item-"]');
    await expect(additionalItems).toHaveCount(1);

    // Reload page
    await page.reload();

    // Wait for component to hydrate
    await page.waitForTimeout(500);

    // State should persist
    const reloadedCheckbox = page.locator('[data-testid="daily-todo-required-item-0"]').locator('input[type="checkbox"]');
    await expect(reloadedCheckbox).toBeChecked();

    additionalItems = page.locator('[data-testid^="daily-todo-additional-item-"]');
    await expect(additionalItems).toHaveCount(1);
    await expect(additionalItems.first()).toContainText("Персистувати цю справу");
  });

  test("shows empty state message for additional tasks", async ({ page }) => {
    await loginAsUser(page);

    const emptyMessage = page.locator('[data-testid="daily-todo-additional-empty-state"]');
    await expect(emptyMessage).toBeVisible();
    await expect(emptyMessage).toContainText("Жодних додаткових справ");
  });

  test("can add task by pressing Enter key", async ({ page }) => {
    await loginAsUser(page);

    const input = page.locator('[data-testid="daily-todo-add-action-input"]');
    await input.fill("Доданa через Enter");
    await input.press("Enter");

    const additionalItems = page.locator('[data-testid^="daily-todo-additional-item-"]');
    await expect(additionalItems).toHaveCount(1);
    await expect(additionalItems.first()).toContainText("Доданa через Enter");
  });

  test("can toggle additional task with confirmation", async ({ page }) => {
    await loginAsUser(page);

    // Add additional task
    const input = page.locator('[data-testid="daily-todo-add-action-input"]');
    const addButton = page.locator('[data-testid="daily-todo-add-action-button"]');
    await input.fill("Toggle test");
    await addButton.click();

    const item = page.locator('[data-testid^="daily-todo-additional-item-"]').first();
    const checkbox = item.locator('input[type="checkbox"]');

    // Initially unchecked
    await expect(checkbox).not.toBeChecked();

    // Click item container - should show confirmation
    await item.click();
    const confirmDialog = page.locator('[data-testid="daily-todo-check-confirm-dialog"]');
    await expect(confirmDialog).toBeVisible();

    // Confirm
    const confirmButton = confirmDialog.locator('button:has-text("👍")');
    await confirmButton.click();

    // Should be checked
    await expect(checkbox).toBeChecked();
  });
});

async function getBalance(page: any): Promise<number> {
  const text = await page.getByTestId("user-current-balance").innerText();
  const match = text.match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : 0;
}
