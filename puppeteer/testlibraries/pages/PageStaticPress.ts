export default class PageStaticPress {
  public async clickRebuild() {
    await Promise.all([
      page.waitForXPath('//p[@id="message"]/strong[text()="End"]', {visible: true, timeout: 3 * 60 * 1000}),
      page.waitForXPath('//ul[@class="result-list"]/li[contains(text(), "/tmp/static/sub/index.html")]', {visible: true, timeout: 3 * 60 * 1000}),
      page.click('input[value="Rebuild"]')
    ]);
  }
}
