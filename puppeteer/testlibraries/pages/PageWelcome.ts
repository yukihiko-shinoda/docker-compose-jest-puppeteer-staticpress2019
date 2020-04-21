export default class PageWelcome {
  public async install(siteTitle: string, userName: string, password: string, email: string) {
    await page.type('input[id="weblog_title"]', siteTitle, { delay: 50 });
    await page.type('input[id="user_login"]', userName, { delay: 50 });

    const inputPassword = await page.$('#pass1');
    if (inputPassword === null) {
      throw new Error('Input password not found.');
    }
    await inputPassword.click({ clickCount: 3 })
    await inputPassword.type(password);
    await page.type('input[id="admin_email"]', email, { delay: 50 });
    await page.screenshot({ path: 'screenshot.png' });

    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      page.click('input[value="Install WordPress"]')
    ]);
  }
}
