import { Page } from "@playwright/test";

export default class PageLogin {
  constructor(private page: Page) {}

  public async login(userName: string, userPassword: string) {
    const usernameInput = this.page.locator('input#user_login');
    const passwordInput = this.page.locator('input#user_pass');
    const loginButton = this.page.locator('input[type="submit"][name="wp-submit"]');

    await usernameInput.waitFor({ state: 'visible' });
    await usernameInput.fill(userName);

    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(userPassword);

    await loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
