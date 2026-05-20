import { expect, test } from "@playwright/test";

import { loginAsAdmin, loginAsUser } from "./helpers/auth";

const uniqueText = (prefix: string) => `${prefix} ${Math.random().toString(36).slice(2, 10)}`;

test.describe("Admin pending-requests badge", () => {
  test("badge increments when user submits a request and clears on approval", async ({ page }) => {
    // 1. User submits a points request via the UI.
    await loginAsUser(page);
    const description = uniqueText("Badge e2e");

    await page.getByTestId("user-nav-add").click();
    await page.getByTestId("user-add-points-amount-input").fill("3");
    await page.getByTestId("user-add-points-description-input").fill(description);
    await page.getByTestId("user-add-points-submit-button").click();

    await expect(
      page
        .locator('[data-testid^="user-pending-request-"]')
        .filter({ hasText: description })
    ).toBeVisible();

    // 2. Admin logs in (same browser, fresh session). Bottom nav badge must be visible.
    await loginAsAdmin(page);

    const badge = page.getByTestId("admin-nav-pending-badge");
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText(/\d+/);

    const countBefore = Number.parseInt((await badge.textContent()) ?? "0", 10);

    // 3. Open /admin/points and approve the specific request we created.
    await page.goto("/admin/points");

    const request = page
      .locator('[data-testid^="admin-pending-request-"]')
      .filter({ hasText: description })
      .first();
    await expect(request).toBeVisible();

    await request.getByRole("button", { name: "Підтвердити" }).click();

    // 4. The approved request leaves the pending block.
    await expect(request).toHaveCount(0);

    // 5. Badge count must decrease (or the badge disappears if this was the last one).
    await expect
      .poll(async () => {
        const visible = await badge.isVisible().catch(() => false);
        if (!visible) {
          return 0;
        }
        return Number.parseInt((await badge.textContent()) ?? "0", 10);
      }, { timeout: 5000 })
      .toBeLessThan(countBefore);
  });
});
