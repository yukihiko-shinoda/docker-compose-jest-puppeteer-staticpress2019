import { Page } from "@playwright/test";

export default class PageStaticPress {
  constructor(private page: Page) {}

  public async clickRebuild() {
    await this.page.click('input[value="Rebuild"]');
    await this.page.locator('xpath=.//p[@id="message"]/strong[text()="End"]').waitFor({ state: 'visible', timeout: 3 * 60 * 1000 });
    await this.page.locator('xpath=.//ul[@class="result-list"]/li[contains(text(), "/tmp/static/sub/index.html")]').waitFor({ state: 'visible', timeout: 3 * 60 * 1000 });
  }
}
