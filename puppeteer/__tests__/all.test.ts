import { createConnection, getRepository } from "typeorm";
import { ElementHandle } from "puppeteer";
import PageWelcome from "../testlibraries/pages/PageWelcome";
import PageLogin from "../testlibraries/pages/PageLogin";
import RoutineOperation from "../testlibraries/RoutineOperation"
import PageAdmin from "../testlibraries/pages/PageAdmin";
import PagePlugins from "../testlibraries/pages/PagePlugins";
import PageStaticPressOptions from "../testlibraries/pages/PageStaticPressOptions";
import { WpOption } from "../testlibraries/entities/WpOption";
import FixtureLoader from "../testlibraries/FixtureLoader";
import TableCleaner from "../testlibraries/TableCleaner";
import PageStaticPress from "../testlibraries/pages/PageStaticPress";
import PageLanguageChooser from "../testlibraries/pages/PageLanguageChooser";

describe('All', () => {
  require('dotenv').config()
  const host = process.env.HOST || "http://localhost/";
  const basicAuthenticationUserName = "authuser";
  const basicAuthenticationUserPassword = "authpassword";
  const userName = "test_user";
  const userPassword = "-JfG+L.3-s!A6YmhsKGkGERc+hq&XswU";
  beforeAll(async () => {
    // To prevent shutdown browser.
    jest.setTimeout(5 * 60 * 1000);
    await page.setExtraHTTPHeaders({
      Authorization: `Basic ${new Buffer(`${basicAuthenticationUserName}:${basicAuthenticationUserPassword}`).toString('base64')}`
    });
    await page.goto(host);
    // jest.setTimeout(24 * 60 * 60 * 1000);
    // await jestPuppeteer.debug();
    await page.screenshot({ path: 'screenshot1.png' });

    // From WordPress 5.4.2, language select page is displayed at first.
    if (await PageLanguageChooser.isDisplayedNow()) {
      const pageLanguageChooser = new PageLanguageChooser();
      await pageLanguageChooser.choose("English (United States)");
    }
    if (await PageWelcome.isDisplayedNow()) {
      await initialize();
      return;
    }
    await login();
});

  async function initialize() {
    const pageWelcome = new PageWelcome();
    await pageWelcome.install("test_title", userName, userPassword, "test@gmail.com");

    await RoutineOperation.clickByText(page, 'a', 'Log In');
    await page.waitForNavigation({ waitUntil: ["load", "networkidle2"] });

    await login();
    const pageAdmin = new PageAdmin();
    await pageAdmin.clickMenu('Plugins');
    const pagePlugins = new PagePlugins();
    await pagePlugins.activatePlugin('StaticPress2019');
  }

  async function login() {
    await page.goto(host + 'wp-admin/', { waitUntil: ["load", "networkidle2"] });
    const pageLogin = new PageLogin();
    await pageLogin.login(userName, userPassword);
  }

  beforeEach(async () => {
    console.log("Inserting fixtures into the database...");
    await TableCleaner.clean().catch(err => {
      console.log(err)
      throw err
    });
    await FixtureLoader.load('./testlibraries/fixtures/WpOptionsStaticPress2019.yml').then(() => {
      console.log('Fixtures are successfully loaded.');
    }).catch(err => {
      console.log(err)
      throw err
    });
    console.log("Inserted fixtures into the database.");
  });

  /**
   * Option should set into database.
   * Home page should dump by rebuild even if basic authentication is enable.
   */
  test("sets option and rebuilds", async () => {
    // To prevent shutdown browser.
    jest.setTimeout(5 * 60 * 1000);
    await page.goto(host + 'wp-admin/', { waitUntil: ["load", "networkidle2"] });
    const pageAdmin = new PageAdmin();
    await pageAdmin.hoverMenu('StaticPress2019');
    await pageAdmin.waitForSubMenu('StaticPress2019 Options');
    await pageAdmin.clickSubMenu('StaticPress2019 Options');

    const pageStaticPressOptions = new PageStaticPressOptions();
    const staticUrl = 'http://example.com/sub/';
    const dumpDirectory = '/tmp/static/';
    const requestTimeout = '10';
    await pageStaticPressOptions.setOptions(
      staticUrl,
      dumpDirectory,
      basicAuthenticationUserName,
      basicAuthenticationUserPassword,
      requestTimeout
    );
    let connection;
    try {
      connection = await createConnection();

      const wpOptionRepository = getRepository(WpOption);
      const wpOptionStaticUrl = await wpOptionRepository.findOneOrFail({ optionName: 'StaticPress::static url' });
      expect(wpOptionStaticUrl.optionValue).toEqual(staticUrl);
      const wpOptionDumpDirectory = await wpOptionRepository.findOneOrFail({ optionName: 'StaticPress::static dir' });
      expect(wpOptionDumpDirectory.optionValue).toEqual(dumpDirectory);
      // const basicAuthentication = ;
      // const wpOptionBasicAuthentication = await wpOptionRepository.findOneOrFail({optionName: 'StaticPress::basic auth'});
      // expect(wpOptionBasicAuthentication.optionValue).toEqual(basicAuthentication);
      const wpOptionRequestTimeout = await wpOptionRepository.findOneOrFail({ optionName: 'StaticPress::timeout' });
      expect(wpOptionRequestTimeout.optionValue).toEqual(requestTimeout);
    } catch (err) {
      throw err;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
    await pageAdmin.hoverMenu('StaticPress2019');
    await pageAdmin.waitForSubMenu('StaticPress2019');
    await pageAdmin.clickSubMenu('StaticPress2019');
    const pageStaticPress = new PageStaticPress();
    // jest.setTimeout(24 * 60 * 60 * 1000);
    // await jestPuppeteer.debug();
    await pageStaticPress.clickRebuild();
    await expect(page).toMatchElement('li', { text: /.*\/tmp\/static\/sub\/index\.html/ })
    // await createConnection().then(async connection => {
    //   console.log("Loading users from the database...");
    //   const wpOption = await connection.manager.findOne(WpOption, { optionName: 'StaticPress::static url' });
    //   console.log("Loaded wpOption: ", wpOption);

    //   console.log("Here you can setup and run express/koa/any other framework.");
    //   await connection.close();
    // }).catch(async error => console.log(error));
    // jest.setTimeout(24 * 60 * 60 * 1000);
    // await jestPuppeteer.debug();

    // await page.screenshot({ path: 'screenshot.png' });
    // await expect(page).toMatch('google')
  });
});
