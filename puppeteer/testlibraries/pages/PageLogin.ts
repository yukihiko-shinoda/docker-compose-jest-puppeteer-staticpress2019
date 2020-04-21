export default class PageLogin {
  public async login(userName: string, userPassword: string) {
    await page.type('input[id="user_login"]', userName, { delay: 50 });
    await page.type('input[id="user_pass"]', userPassword, { delay: 50 });
    await Promise.all([
      page.waitForNavigation({ waitUntil: ["load", "networkidle2"] }),
      page.click('input[value="Log In"]')
    ]);
  }
}
