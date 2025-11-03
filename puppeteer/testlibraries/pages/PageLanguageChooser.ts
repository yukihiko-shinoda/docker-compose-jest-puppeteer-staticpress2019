import { ElementHandle } from "puppeteer";

export default class PageLanguageChooser {
  public async choose(language: string) {
    await page.select('select[id="language"]', language);

    await Promise.all([
      page.waitForNavigation({ waitUntil: ["load", "networkidle2"] }),
      page.click('input[value="Continue"]')
    ]);
  }
  static async isDisplayedNow() {
    return await page.$x('//label[text()="Select a default language"]').then((elementHandle) => elementHandle.length !== 0)
  }
}
