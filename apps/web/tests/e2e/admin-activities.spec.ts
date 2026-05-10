import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";

const uniqueText = (prefix: string) => `${prefix} ${Math.random().toString(36).slice(2, 10)}`;

test.describe("Admin Activities Management", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("should display activities management page", async ({ page }) => {
    await page.goto("/admin/activities");
    await expect(page.getByRole("heading", { name: "Управління активностями" })).toBeVisible();
  });

  test("should create a new activity", async ({ page }) => {
    const activityDescription = uniqueText("Clean room");

    await page.goto("/admin");
    await page.getByTestId("create-activity-button").click();

    await expect(page).toHaveURL("/admin/activities/create");
    await page.getByTestId("activity-description-input").fill(activityDescription);
    await page.getByTestId("activity-points-input").fill("4");
    await page.getByTestId("activity-submit-button").click();

    await expect(page).toHaveURL("/admin/activities");
    await expect(page.getByText(activityDescription)).toBeVisible();
    await expect(page.getByText("4 очок")).toBeVisible();
  });

  test("should edit and delete an activity", async ({ page }) => {
    const activityDescription = uniqueText("Editable activity");
    const updatedDescription = `${activityDescription} updated`;

    await page.goto("/admin/activities/create");
    await page.getByTestId("activity-description-input").fill(activityDescription);
    await page.getByTestId("activity-points-input").fill("3");
    await page.getByTestId("activity-submit-button").click();

    await expect(page).toHaveURL("/admin/activities");

    const activityRow = page
      .locator('[data-testid^="activity-row-"]')
      .filter({ hasText: activityDescription })
      .first();
    await expect(activityRow).toBeVisible();

    await activityRow.getByRole("button", { name: "Редагувати" }).click();
    await expect(page).toHaveURL(/\/admin\/activities\/.*\/edit$/);

    await page.getByTestId("activity-description-input").fill(updatedDescription);
    await page.getByTestId("activity-points-input").fill("6");
    await page.getByTestId("activity-submit-button").click();

    await expect(page).toHaveURL("/admin/activities");

    const updatedRow = page
      .locator('[data-testid^="activity-row-"]')
      .filter({ hasText: updatedDescription })
      .first();

    await expect(updatedRow).toBeVisible();
    await expect(updatedRow.getByText("6 очок")).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await updatedRow.getByRole("button", { name: "Видалити" }).click();
    await expect(
      page
        .locator('[data-testid^="activity-row-"]')
        .filter({ hasText: updatedDescription })
        .first()
    ).toHaveCount(0, { timeout: 10_000 });
  });

  test("should reorder activities with drag and drop", async ({ page }) => {
    const firstDescription = uniqueText("First activity");
    const secondDescription = uniqueText("Second activity");

    await page.goto("/admin/activities/create");
    await page.getByTestId("activity-description-input").fill(firstDescription);
    await page.getByTestId("activity-points-input").fill("2");
    await page.getByTestId("activity-submit-button").click();

    await page.goto("/admin/activities/create");
    await page.getByTestId("activity-description-input").fill(secondDescription);
    await page.getByTestId("activity-points-input").fill("5");
    await page.getByTestId("activity-submit-button").click();

    await expect(page).toHaveURL("/admin/activities");

    const firstRow = page
      .locator('[data-testid^="activity-row-"]')
      .filter({ hasText: firstDescription })
      .first();
    const secondRow = page
      .locator('[data-testid^="activity-row-"]')
      .filter({ hasText: secondDescription })
      .first();

    await secondRow.dragTo(firstRow);

    // Wait for the reorder to be applied instantly
    await page.waitForTimeout(500);
    await page.reload();

    const rowTexts = await page.locator('[data-testid^="activity-row-"]').allInnerTexts();
    const firstIndex = rowTexts.findIndex((text) => text.includes(firstDescription));
    const secondIndex = rowTexts.findIndex((text) => text.includes(secondDescription));

    expect(firstIndex).toBeGreaterThan(-1);
    expect(secondIndex).toBeGreaterThan(-1);
    expect(secondIndex).toBeLessThan(firstIndex);
  });
});
