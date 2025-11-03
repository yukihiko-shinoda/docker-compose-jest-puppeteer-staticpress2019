import { ElementHandle } from "puppeteer";

export default class PageWelcome {
  public async install(siteTitle: string, userName: string, password: string, email: string) {
    await page.type('input[id="weblog_title"]', siteTitle, { delay: 50 });
    await page.type('input[id="user_login"]', userName, { delay: 50 });

    let inputPassword = await page.$('#pass1');
    if (inputPassword === null) {
      throw new Error('Input password not found.');
    }
    // #pass1 is password input on modern WordPress, however, #pass1-text is the one at least on WordPress 4.3.
    if (!await inputPassword.isIntersectingViewport()) {
      inputPassword = await page.$('#pass1-text');
      if (inputPassword === null) {
        throw new Error('Input password not found.');
      }
    }
    await inputPassword.click({ clickCount: 3 })
    await inputPassword.type(password);
    await page.type('input[id="admin_email"]', email, { delay: 50 });
    await page.screenshot({ path: 'screenshot.png' });

    await Promise.all([
      page.waitForNavigation({ waitUntil: ["load", "networkidle2"] }),
      page.click('input[value="Install WordPress"]')
    ]);
  }
  static async isDisplayedNow() {
    // <h2> is used on modern WordPress, however, <h1> is used at least on WordPress 4.3.
    return await page.$$(`xpath/.//*[self::h1 or self ::h2][text()="Information needed"]`).then((elementHandle) => elementHandle.length !== 0)
  }
}
