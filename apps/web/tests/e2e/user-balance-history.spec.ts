import { type Page, expect, test } from "@playwright/test";
import { loginAsAdmin, loginAsUser } from "./helpers/auth";

const uniqueText = (prefix: string) => `${prefix} ${Math.random().toString(36).slice(2, 10)}`;

const readUserBalance = async (page: Page) => {
  const text = await page.getByTestId("user-current-balance").innerText();
  const match = text.match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : 0;
};

test.describe("User balance and history", () => {
  test("shows current balance and history from server data", async ({ page }) => {
    const description = uniqueText("User history entry");

    await loginAsAdmin(page);
    await page.goto("/admin/points");
    await page.getByTestId("points-action-select").selectOption("award");
    await page.getByTestId("points-amount-input").fill("5");
    await page.getByTestId("points-description-input").fill(description);
    await page.getByTestId("points-submit-button").click();
    await expect(
      page.locator('[data-testid^="points-log-"]').filter({ hasText: description }).first()
    ).toBeVisible();

    await loginAsUser(page);
    await expect(page.getByTestId("user-current-balance")).toBeVisible();
    await page.getByTestId("user-nav-history").click();

    const historyEntry = page
      .locator('[data-testid^="user-history-item-"]')
      .filter({ hasText: description })
      .first();

    await expect(historyEntry).toBeVisible();
    await expect(historyEntry).toContainText("+5");
  });

  test("keeps balance and history after refresh", async ({ page }) => {
    const description = uniqueText("User persist entry");

    await loginAsAdmin(page);
    await page.goto("/admin/points");
    await page.getByTestId("points-action-select").selectOption("award");
    await page.getByTestId("points-amount-input").fill("3");
    await page.getByTestId("points-description-input").fill(description);
    await page.getByTestId("points-submit-button").click();
    await expect(
      page.locator('[data-testid^="points-log-"]').filter({ hasText: description }).first()
    ).toBeVisible();

    await loginAsUser(page);
    await page.getByTestId("user-nav-history").click();

    const historyEntry = page
      .locator('[data-testid^="user-history-item-"]')
      .filter({ hasText: description })
      .first();

    await page.getByTestId("user-nav-balance").click();
    await expect(page.getByTestId("user-current-balance")).toBeVisible();
    await page.getByTestId("user-nav-history").click();
    await expect(historyEntry).toBeVisible();

    await page.reload();

    const persistedEntry = page
      .locator('[data-testid^="user-history-item-"]')
      .filter({ hasText: description })
      .first();

    await page.getByTestId("user-nav-balance").click();
    await expect(page.getByTestId("user-current-balance")).toBeVisible();
    await page.getByTestId("user-nav-history").click();
    await expect(persistedEntry).toBeVisible();
  });

  test("user request is visible in pending list and moves to history after admin approval", async ({ page }) => {
    const description = uniqueText("Запит очок");

    await loginAsUser(page);
    const initialBalance = await readUserBalance(page);
    await page.getByTestId("user-nav-add").click();
    await page.getByTestId("user-add-points-amount-input").fill("4");
    await page.getByTestId("user-add-points-description-input").fill(description);
    await page.getByTestId("user-add-points-submit-button").click();

    const userPendingRequest = page
      .locator('[data-testid^="user-pending-request-"]')
      .filter({ hasText: description })
      .first();

    await expect(userPendingRequest).toBeVisible();
    await page.getByTestId("user-nav-balance").click();
    expect(await readUserBalance(page)).toBe(initialBalance);

    await loginAsAdmin(page);
    await page.goto("/admin/points");

    const adminPendingRequest = page
      .locator('[data-testid^="admin-pending-request-"]')
      .filter({ hasText: description })
      .first();

    await expect(adminPendingRequest).toBeVisible();
    await adminPendingRequest.locator('[data-testid^="admin-approve-request-"]').click();
    await expect(adminPendingRequest).toHaveCount(0);

    await loginAsUser(page);
    await page.getByTestId("user-nav-add").click();
    await expect(
      page.locator('[data-testid^="user-pending-request-"]').filter({ hasText: description }).first()
    ).toHaveCount(0);

    await page.getByTestId("user-nav-balance").click();
    expect(await readUserBalance(page)).toBe(initialBalance + 4);
    await page.getByTestId("user-nav-history").click();
    await expect(
      page.locator('[data-testid^="user-history-item-"]').filter({ hasText: description }).first()
    ).toBeVisible();
  });

  test("rejected user request disappears from pending list and is hidden from user history", async ({ page }) => {
    const description = uniqueText("Відхилений запит");

    await loginAsUser(page);
    await page.getByTestId("user-nav-add").click();
    await page.getByTestId("user-add-points-amount-input").fill("2");
    await page.getByTestId("user-add-points-description-input").fill(description);
    await page.getByTestId("user-add-points-submit-button").click();
    await expect(
      page.locator('[data-testid^="user-pending-request-"]').filter({ hasText: description }).first()
    ).toBeVisible();

    await loginAsAdmin(page);
    await page.goto("/admin/points");

    const adminPendingRequest = page
      .locator('[data-testid^="admin-pending-request-"]')
      .filter({ hasText: description })
      .first();

    await expect(adminPendingRequest).toBeVisible();
    await adminPendingRequest.locator('[data-testid^="admin-reject-request-"]').click();
    await expect(adminPendingRequest).toHaveCount(0);

    await loginAsUser(page);
    await page.getByTestId("user-nav-add").click();
    await expect(
      page.locator('[data-testid^="user-pending-request-"]').filter({ hasText: description }).first()
    ).toHaveCount(0);

    await page.getByTestId("user-nav-history").click();
    await expect(
      page.locator('[data-testid^="user-history-item-"]').filter({ hasText: description }).first()
    ).toHaveCount(0);
  });
});
