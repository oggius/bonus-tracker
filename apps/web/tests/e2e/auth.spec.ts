import { test, expect } from "@playwright/test";
import { loginAsAdmin, loginAsUser } from "./helpers/auth";

test.describe("Password auth and role routing", () => {
  test("auth submit disables controls while waiting for response", async ({ page }) => {
    await page.route("**/*", async (route) => {
      if (route.request().method() === "POST") {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }

      await route.continue();
    });

    await page.goto("/");
    await page.getByTestId("password-input").fill("9999");
    await page.getByTestId("login-button").click();

    await expect(page.getByTestId("password-input")).toBeDisabled();
    await expect(page.getByTestId("login-button")).toBeDisabled();
    await expect(page.getByTestId("login-button")).toContainText("Вхід...");
    await expect(page.locator('input[type="checkbox"]').first()).toBeDisabled();

    await expect(page).toHaveURL("/?error=invalid_credentials");
    await expect(page.getByTestId("password-input")).toBeEnabled();
    await expect(page.getByTestId("login-button")).toBeEnabled();
  });

  test("anonymous users are redirected to login when opening protected routes", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "BonusTracker" })).toBeVisible();
  });

  test("user password lands on user route and cannot access admin route", async ({ page }) => {
    await loginAsUser(page);

    await expect(page).toHaveURL("/user");
    await expect(page.getByTestId("user-current-balance")).toBeVisible();

    await page.goto("/admin");
    await expect(page).toHaveURL("/user");
  });

  test("admin can log in and cannot access user route", async ({ page }) => {
    await loginAsAdmin(page);

    await expect(page).toHaveURL("/admin");
    await expect(page.getByText("Адмін-панель")).toBeVisible();

    await page.goto("/user");
    await expect(page).toHaveURL("/admin");
  });

  test("invalid password is rejected with an error", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("password-input").fill("9999");
    await page.getByTestId("login-button").click();

    await expect(page).toHaveURL("/?error=invalid_credentials");
    await expect(page.getByText("Невірний пароль. Спробуйте ще раз.")).toBeVisible();
  });

  test("user can log out from bottom nav and return to login page", async ({ page }) => {
    await loginAsUser(page);

    await expect(page).toHaveURL("/user");
    await page.getByTestId("user-nav-logout").click();

    await expect(page).toHaveURL("/");
    await expect(page.getByTestId("login-button")).toBeVisible();
  });
});
