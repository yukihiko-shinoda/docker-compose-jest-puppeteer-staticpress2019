import { ElementHandle } from "puppeteer";
import PageWelcome from "../testlibraries/pages/PageWelcome";
import PageLogin from "../testlibraries/pages/PageLogin";
import RoutineOperation from "../testlibraries/RoutineOperation"
import PageAdmin from "../testlibraries/pages/PageAdmin";
import PagePlugins from "../testlibraries/pages/PagePlugins";
import PageStaticPressOptions from "../testlibraries/pages/PageStaticPressOptions";

describe('All', () => {
  const host = 'http://localhost/';
  const userName = "test_user";
  const userPassword = "-JfG+L.3-s!A6YmhsKGkGERc+hq&XswU";
  beforeAll(async () => {
    // To prevent shutdown browser.
    jest.setTimeout(600000);
    await page.goto(host);
    await page.screenshot({ path: 'screenshot1.png' });

    if (await page.$x('//h2[text()="Information needed"]').then((elementHandle: ElementHandle<Element>[]) => elementHandle.length === 0)) {
      await page.goto(host + 'admin/', { waitUntil: ["load", "networkidle2"] });
      const pageLogin = new PageLogin();
      await pageLogin.login(userName, userPassword);
      return;
    }

    const pageWelcome = new PageWelcome();
    await pageWelcome.install("test_title", userName, userPassword, "test@gmail.com");

    await RoutineOperation.clickByText(page, 'a', 'Log In');
    await page.waitForNavigation({ waitUntil: ["load", "networkidle2"] });

    const pageLogin = new PageLogin();
    await pageLogin.login(userName, userPassword);
    const pageAdmin = new PageAdmin();
    await pageAdmin.clickMenu('Plugins');
    const pagePlugins = new PagePlugins();
    await pagePlugins.activatePlugin('StaticPress2019');
  })

  it("sets StaticPress2019 options", async () => {
    const pageAdmin = new PageAdmin();
    await pageAdmin.hoverMenu('StaticPress2019');
    await pageAdmin.waitForSubMenu('StaticPress2019 Options');
    await pageAdmin.clickSubMenu('StaticPress2019 Options');

    const pageStaticPressOptions = new PageStaticPressOptions();
    pageStaticPressOptions.setOptions('http://example.com/sub/', '/tmp/static/', 'UserName', 'UserPassword', '10');
    jest.setTimeout(24 * 60 * 60 * 1000);
    await jestPuppeteer.debug();

    await page.screenshot({ path: 'screenshot.png' });
    await expect(page).toMatch('google')
  });
})
