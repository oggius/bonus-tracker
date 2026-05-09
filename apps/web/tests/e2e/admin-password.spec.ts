import { expect, test } from "@playwright/test";

import {
  ADMIN_DEFAULT_PASSWORD,
  ADMIN_UPDATED_PASSWORD,
  USER_UPDATED_PASSWORD,
} from "./helpers/auth";

test.describe("Admin password management", () => {
  test("admin is forced to rotate default password on first login", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("password-input").fill(ADMIN_DEFAULT_PASSWORD);
    await page.getByTestId("login-button").click();

    await expect(page).toHaveURL("/admin/settings");
    await expect(page.getByText("Для безпеки потрібно змінити стандартний пароль адміністратора.")).toBeVisible();

    await page.getByTestId("admin-current-password-input").fill(ADMIN_DEFAULT_PASSWORD);
    await page.getByTestId("admin-new-password-input").fill(ADMIN_UPDATED_PASSWORD);
    await page.getByTestId("admin-confirm-password-input").fill(ADMIN_UPDATED_PASSWORD);
    await page.getByTestId("admin-password-submit-button").click();

    await expect(page).toHaveURL("/admin");
  });

  test("admin can set user password and user can log in with new password", async ({ page }) => {
    // Login as admin with the rotated password.
    await page.goto("/");
    await page.getByTestId("password-input").fill(ADMIN_UPDATED_PASSWORD);
    await page.getByTestId("login-button").click();
    await expect(page).toHaveURL("/admin");

    await page.goto("/admin/settings");
    await page.getByTestId("user-new-password-input").fill(USER_UPDATED_PASSWORD);
    await page.getByTestId("user-confirm-password-input").fill(USER_UPDATED_PASSWORD);
    await page.getByTestId("user-password-submit-button").click();

    await page.context().clearCookies();
    await page.goto("/");
    await page.getByTestId("password-input").fill(USER_UPDATED_PASSWORD);
    await page.getByTestId("login-button").click();
    await expect(page).toHaveURL("/user");

  });
});
