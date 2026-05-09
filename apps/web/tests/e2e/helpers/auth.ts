import { expect, type Page } from "@playwright/test";

export const ADMIN_DEFAULT_PASSWORD = "1234";
export const ADMIN_UPDATED_PASSWORD = "Admin#1234";
export const USER_DEFAULT_PASSWORD = "0000";
export const USER_UPDATED_PASSWORD = "User#1234";

async function submitLogin(page: Page, password: string) {
  await page.goto("/");
  await page.getByTestId("password-input").fill(password);
  await page.getByTestId("login-button").click();
  await page.waitForURL((url) => {
    const path = url.pathname;
    const search = url.search;
    return path !== "/" || search.includes("error=invalid_credentials");
  });
}

export async function loginAsAdmin(page: Page) {
  await page.context().clearCookies();
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await submitLogin(page, ADMIN_DEFAULT_PASSWORD);

  if (page.url().includes("/admin/settings")) {
    await page.getByTestId("admin-current-password-input").fill(ADMIN_DEFAULT_PASSWORD);
    await page.getByTestId("admin-new-password-input").fill(ADMIN_UPDATED_PASSWORD);
    await page.getByTestId("admin-confirm-password-input").fill(ADMIN_UPDATED_PASSWORD);
    await page.getByTestId("admin-password-submit-button").click();
    await expect(page).toHaveURL("/admin");
    return;
  }

  if (page.url().includes("error=invalid_credentials")) {
    await submitLogin(page, ADMIN_UPDATED_PASSWORD);
    await expect(page).toHaveURL("/admin");
    return;
  }

  await expect(page).toHaveURL("/admin");
}

export async function loginAsUser(page: Page) {
  await page.context().clearCookies();
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await submitLogin(page, USER_DEFAULT_PASSWORD);

  if (page.url().includes("error=invalid_credentials")) {
    await submitLogin(page, USER_UPDATED_PASSWORD);
  }

  await expect(page).toHaveURL("/user");
}
