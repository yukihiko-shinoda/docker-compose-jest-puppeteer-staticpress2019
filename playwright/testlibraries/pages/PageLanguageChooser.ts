import { Page } from "@playwright/test";

export default class PageLanguageChooser {
  constructor(private page: Page) {}

  public async choose(language: string) {
    await this.page.selectOption('select[id="language"]', language);

    await this.page.click('input[value="Continue"]');
    await this.page.waitForLoadState('networkidle');
  }

  public async isDisplayedNow(): Promise<boolean> {
    const locator = this.page.locator('xpath=.//label[text()="Select a default language"]');
    return await locator.count() > 0;
  }
}
