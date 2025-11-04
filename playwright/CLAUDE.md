# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an E2E integration test suite for **StaticPress** (a WordPress plugin) using Playwright. The tests verify WordPress installation, plugin activation, configuration, and the rebuild functionality of StaticPress2019.

## Commands

### Running Tests
```bash
npm test                      # Run all E2E tests
npx playwright test          # Alternative way to run tests
npx playwright test --headed # Run tests in headed mode
npx playwright test --debug  # Run tests in debug mode
```

### Development Setup
```bash
npm ci                         # Install dependencies (use this instead of npm install)
npx playwright install         # Install Playwright browsers
```

### Environment Configuration
The project uses `.env` files for configuration. Key environment variables:
- `HOST` - WordPress site URL (default: http://localhost/)
- `DATABASE_HOST` - MySQL host (default: localhost)
- `HEADLESS` - Run browser in headless mode (default: true)

## Architecture

### Test Structure
- **Main test file**: `__tests__/all.test.ts` - Contains the primary E2E test flow
- **Page Object Model**: `testlibraries/pages/` - Separate page objects for each WordPress admin page
- **Test utilities**: `testlibraries/` - Shared helper classes

### Key Components

**Database Integration (TypeORM)**
- `ormconfig.ts` - Database configuration for MySQL connection
- `testlibraries/entities/` - TypeORM entity definitions for WordPress database tables (wp_options, wp_posts, etc.)
- `testlibraries/FixtureLoader.ts` - Loads YAML fixtures into the database using typeorm-fixtures-cli
- `testlibraries/TableCleaner.ts` - Cleans up StaticPress-specific options before each test
- Connection pattern: Create connection → Execute operations → Close connection in finally block

**Page Objects (Playwright)**
- `PageWelcome.ts` - WordPress installation flow
- `PageLogin.ts` - Login functionality
- `PageAdmin.ts` - WordPress admin menu navigation (hover, click menu/submenu)
- `PagePlugins.ts` - Plugin activation
- `PageStaticPressOptions.ts` - StaticPress configuration form
- `PageStaticPress.ts` - StaticPress rebuild operations
- `PageLanguageChooser.ts` - WordPress 5.4.2+ language selection

**Utility Classes**
- `RoutineOperation.ts` - XPath-based helpers for clicking elements by text
- All page objects receive a `Page` instance via constructor injection

### Test Flow
1. **test.beforeAll**: Basic authentication setup → Navigate to WordPress → Handle language selection if needed → Install WordPress or login
2. **test.beforeEach**: Clean StaticPress options from database → Load fixtures from YAML
3. **test**: Navigate admin pages → Set StaticPress options → Verify options in database → Trigger rebuild → Verify output

### Configuration Files

**Playwright Setup**
- `playwright.config.ts` - Playwright configuration with browser settings, timeout (5 minutes), viewport, and HTTP credentials
- Test timeout: 5 minutes (300000ms) configured in playwright.config.ts

**TypeScript**
- Target: ES2017, CommonJS modules
- Output: `./build` directory
- Strict mode enabled
- Experimental decorators enabled (for TypeORM)

**Docker**
- `Dockerfile` - Based on Playwright CI setup with Chromium dependencies
- Installs system packages for headless Chromium
- Installs Playwright browsers with `npx playwright install --with-deps chromium`
- Runs tests in container with `npm test`

## Development Notes

### WordPress Compatibility
The test suite handles multiple WordPress versions:
- Language chooser page only appears in WordPress 5.4.2+
- Password input: `#pass1` (modern) vs `#pass1-text` (WordPress 4.3)
- Heading tags: `<h2>` (modern) vs `<h1>` (WordPress 4.3)

### Database Fixtures
Fixtures are stored in `testlibraries/fixtures/`:
- `WpOptionsDefault.yml` - Default WordPress options
- `WpOptionsStaticPress2019.yml` - StaticPress-specific test data

### Basic Authentication
Tests support sites behind HTTP basic auth:
- Credentials hardcoded: `authuser` / `authpassword`
- Set via `httpCredentials` in playwright.config.ts

### Playwright Best Practices Used
- `page.waitForLoadState('networkidle')` for stable page loads
- `Promise.all()` pattern for clicks that trigger navigation
- Screenshots for debugging (`screenshot.png`, `screenshot1.png`)
- XPath queries with `page.locator('xpath=...')` for reliable element selection by text content
- Locators instead of ElementHandles for better auto-waiting and retry behavior
- Page object pattern with Page instances passed via constructor

## TypeORM Usage Pattern

All database operations follow this pattern:
```typescript
let connection;
try {
  connection = await createConnection();
  // ... database operations
} catch (err) {
  throw err;
} finally {
  if (connection) {
    await connection.close();
  }
}
```

Note: The codebase uses deprecated TypeORM v0.2 API (`createConnection`, `getRepository`). Modern TypeORM uses `DataSource`.
