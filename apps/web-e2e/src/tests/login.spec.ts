import { test, expect } from '@playwright/test';
import { LoginPageObject } from '@poms';

test('login works', async ({ page }) => {
  const loginPage = new LoginPageObject(page);

  await loginPage.goto();
  await loginPage.username.fill('admin');
  await loginPage.password.fill('password');
  await loginPage.loginButton.click();

  await expect(page.getByText('Home')).toBeVisible();
});
