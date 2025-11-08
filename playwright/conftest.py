"""
Pytest configuration and fixtures for Playwright tests.

This replaces the beforeAll and beforeEach hooks from the TypeScript version
in __tests__/all.test.ts.
"""
import os

import pytest
from dotenv import load_dotenv
from playwright.sync_api import Browser
from playwright.sync_api import Page

from testlibraries import FixtureLoader
from testlibraries import RoutineOperation
from testlibraries import TableCleaner
from testlibraries.pages import PageAdmin
from testlibraries.pages import PageLanguageChooser
from testlibraries.pages import PageLogin
from testlibraries.pages import PagePlugins
from testlibraries.pages import PageWelcome

# Load environment variables from .env file
load_dotenv()

# Test configuration constants
# These replace the constants from all.test.ts
HOST = os.getenv("HOST", "http://localhost/")
USERNAME = "test_user"
PASSWORD = "-JfG+L.3-s!A6YmhsKGkGERc+hq&XswU"
BASIC_AUTH_USERNAME = "authuser"
BASIC_AUTH_PASSWORD = "authpassword"


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args: dict) -> dict:
    """
    Configure browser context with HTTP credentials and viewport.

    This replaces the httpCredentials and viewport settings from
    playwright.config.ts.

    Args:
        browser_context_args: Default browser context arguments from pytest-playwright

    Returns:
        Updated browser context arguments
    """
    return {
        **browser_context_args,
        "base_url": HOST,
        "http_credentials": {
            "username": BASIC_AUTH_USERNAME,
            "password": BASIC_AUTH_PASSWORD,
        },
        "viewport": {"width": 1920, "height": 1080},
        "record_video_dir": "test-results/videos",
        "record_video_size": {"width": 1920, "height": 1080},
    }


@pytest.fixture(scope="session")
def browser_type_launch_args(browser_type_launch_args: dict) -> dict:
    """
    Configure browser launch options.

    This replaces the launchOptions from playwright.config.ts.

    Args:
        browser_type_launch_args: Default launch arguments from pytest-playwright

    Returns:
        Updated browser launch arguments
    """
    headless = os.getenv("HEADLESS", "true").lower() == "true"
    return {
        **browser_type_launch_args,
        "args": ["--no-sandbox", "--disable-setuid-sandbox"],
        "headless": headless,
    }


@pytest.fixture(scope="session", autouse=True)
def setup_wordpress(browser: Browser) -> None:
    """
    One-time setup: Initialize WordPress or login.

    This replaces the test.beforeAll hook from the TypeScript version
    in __tests__/all.test.ts (lines 25-56).

    This fixture runs once per test session and:
    1. Navigates to WordPress (handles basic auth)
    2. Handles language chooser if present (WordPress 5.4.2+)
    3. Either installs WordPress (if welcome page shown) or logs in

    Args:
        browser: Playwright Browser instance from pytest-playwright
    """
    context = browser.new_context(
        http_credentials={
            "username": BASIC_AUTH_USERNAME,
            "password": BASIC_AUTH_PASSWORD,
        },
        viewport={"width": 1920, "height": 1080},
    )
    page = context.new_page()

    try:
        print("Start basic authentication")
        try:
            page.goto(HOST)
        except Exception as err:
            print(err)
            raise err or Exception("page.goto() failed with empty error")
        print("Finish basic authentication")
        page.screenshot(path="screenshot1.png")

        # From WordPress 5.4.2, language select page is displayed at first
        page_language_chooser = PageLanguageChooser(page)
        if page_language_chooser.is_displayed_now():
            print("Start choose language")
            page_language_chooser.choose("English (United States)")
            print("Finish choose language")

        # Check if WordPress needs installation or login
        page_welcome = PageWelcome(page)
        if page_welcome.is_displayed_now():
            print("Start Initialize")
            _initialize_wordpress(page)
            print("Finish Initialize")
        else:
            print("Start login")
            _login_wordpress(page)
            print("Finish login")
    finally:
        context.close()


def _initialize_wordpress(page: Page) -> None:
    """
    Initialize WordPress installation.

    This replaces the initialize() function from the TypeScript version
    in __tests__/all.test.ts (lines 58-71).

    Args:
        page: Playwright Page object
    """
    print("Start Initialize")
    page_welcome = PageWelcome(page)
    page_welcome.install("test_title", USERNAME, PASSWORD, "test@gmail.com")

    RoutineOperation.click_by_text(page, "a", "Log In")
    page.wait_for_load_state("networkidle")

    _login_wordpress(page)

    page_admin = PageAdmin(page)
    page_admin.click_menu("Plugins")

    page_plugins = PagePlugins(page)
    page_plugins.activate_plugin("StaticPress2019")


def _login_wordpress(page: Page) -> None:
    """
    Login to WordPress.

    This replaces the login() function from the TypeScript version
    in __tests__/all.test.ts (lines 73-77).

    Args:
        page: Playwright Page object
    """
    page.goto(HOST + "wp-admin/", wait_until="networkidle")
    page_login = PageLogin(page)
    page_login.login(USERNAME, PASSWORD)


@pytest.fixture(autouse=True)
def setup_database_fixtures() -> None:
    """
    Setup database fixtures before each test.

    This replaces the test.beforeEach hook from the TypeScript version
    in __tests__/all.test.ts (lines 79-92).

    This fixture runs before every test function and:
    1. Cleans StaticPress options from database
    2. Loads test fixtures from YAML file

    The yield statement allows cleanup code after the test if needed.
    """
    print("Inserting fixtures into the database...")
    try:
        TableCleaner.clean()
    except Exception as err:
        print(err)
        raise err or Exception("TableCleaner.clean() failed with empty error")

    try:
        FixtureLoader.load("./testlibraries/fixtures/WpOptionsStaticPress2019.yml")
        print("Fixtures are successfully loaded.")
    except Exception as err:
        print(err)
        raise err or Exception("FixtureLoader.load() failed with empty error")

    print("Inserted fixtures into the database.")
    yield
    # Cleanup after test if needed (currently no cleanup required)
