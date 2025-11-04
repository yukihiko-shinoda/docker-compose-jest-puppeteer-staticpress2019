import { Page } from "@playwright/test";

export default class PageWelcome {
  constructor(private page: Page) {}

  public async install(siteTitle: string, userName: string, password: string, email: string) {
    await this.page.fill('input[id="weblog_title"]', siteTitle);
    await this.page.fill('input[id="user_login"]', userName);

    // #pass1 is password input on modern WordPress, however, #pass1-text is the one at least on WordPress 4.3.
    const pass1 = this.page.locator('#pass1');
    const pass1Text = this.page.locator('#pass1-text');

    const isPass1Visible = await pass1.isVisible().catch(() => false);
    const inputPassword = isPass1Visible ? pass1 : pass1Text;

    await inputPassword.click({ clickCount: 3 });
    await inputPassword.fill(password);
    await this.page.fill('input[id="admin_email"]', email);
    await this.page.screenshot({ path: 'screenshot.png' });

    await this.page.click('input[value="Install WordPress"]');
    await this.page.waitForLoadState('networkidle');
  }

  public async isDisplayedNow(): Promise<boolean> {
    // <h2> is used on modern WordPress, however, <h1> is used at least on WordPress 4.3.
    const locator = this.page.locator('xpath=.//*[self::h1 or self::h2][text()="Information needed"]');
    return await locator.count() > 0;
  }
}
