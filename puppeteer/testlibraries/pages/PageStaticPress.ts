export default class PageStaticPress {
  public async clickRebuild() {
    await Promise.all([
      page.waitForSelector('xpath/.//p[@id="message"]/strong[text()="End"]', {visible: true, timeout: 3 * 60 * 1000}),
      page.waitForSelector('xpath/.//ul[@class="result-list"]/li[contains(text(), "/tmp/static/sub/index.html")]', {visible: true, timeout: 3 * 60 * 1000}),
      page.click('input[value="Rebuild"]')
    ]);
  }
}
