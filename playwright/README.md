# StaticPress E2E Test

End-to-end integration test suite for **StaticPress** (a WordPress plugin) using Playwright and Python.

## Overview

This test suite verifies:
- WordPress installation and configuration
- StaticPress2019 plugin activation
- StaticPress options configuration
- Static site rebuild functionality

## Technology Stack

- **Python 3.10+** - Programming language
- **uv** - Fast Python package manager
- **pytest** - Testing framework
- **Playwright** - Browser automation
- **SQLAlchemy 2.0** - Database ORM
- **PyMySQL** - MySQL database driver

## Prerequisites

- Python 3.10 or higher
- MySQL database (for WordPress)
- WordPress instance (local or remote)

## Installation

### 1. Install uv

#### Linux/macOS
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### macOS (Homebrew)
```bash
brew install uv
```

#### Windows (PowerShell)
```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 2. Install Dependencies

```bash
# Sync all dependencies from pyproject.toml
uv sync

# Install Playwright browsers
uv run playwright install chromium

# Or install with system dependencies
uv run playwright install --with-deps chromium
```

### 3. Configure Environment

Create a `.env` file in the project root:

```env
HOST=http://localhost/
DATABASE_HOST=localhost
HEADLESS=true
```

Environment variables:
- `HOST` - WordPress site URL (default: http://localhost/)
- `DATABASE_HOST` - MySQL host (default: localhost)
- `HEADLESS` - Run browser in headless mode (default: true)

## Running Tests

### Basic Test Execution

```bash
# Run all tests
uv run pytest

# Run tests in headed mode (see browser)
uv run pytest --headed

# Run specific test file
uv run pytest tests/test_all.py

# Run with verbose output
uv run pytest -v
```

### Advanced Options

```bash
# Run tests matching a pattern
uv run pytest -k "rebuild"

# Generate HTML report
uv run pytest --html=report.html --self-contained-html

# Run in debug mode
uv run pytest --headed --slowmo 1000

# Show print statements
uv run pytest -s
```

## Development

### Project Structure

```
/workspace/
├── pyproject.toml              # Project configuration & dependencies
├── pytest.ini                  # Pytest configuration
├── conftest.py                 # Pytest fixtures & test setup
├── .env                        # Environment variables
│
├── tests/                      # Test files
│   └── test_all.py            # Main E2E test
│
├── testlibraries/              # Test utilities & page objects
│   ├── config.py              # Database configuration
│   ├── fixture_loader.py      # Database fixture loader
│   ├── table_cleaner.py       # Database cleanup utility
│   ├── routine_operation.py   # XPath helpers
│   │
│   ├── entities/              # SQLAlchemy models (optional)
│   │   ├── wp_option.py       # WordPress options table
│   │   ├── wp_post.py         # WordPress posts table
│   │   └── ...
│   │
│   ├── pages/                 # Page Object Model
│   │   ├── page_welcome.py            # WordPress installation
│   │   ├── page_login.py              # Login page
│   │   ├── page_admin.py              # Admin menu navigation
│   │   ├── page_plugins.py            # Plugin management
│   │   ├── page_staticpress_options.py # StaticPress settings
│   │   ├── page_staticpress.py        # StaticPress rebuild
│   │   └── page_language_chooser.py   # Language selection
│   │
│   └── fixtures/              # YAML test fixtures
│       ├── wp_options_default.yml
│       └── wp_options_staticpress2019.yml
```

### Adding Dependencies

```bash
# Add a runtime dependency
uv add package-name

# Add a development dependency
uv add --dev package-name

# Update all dependencies
uv sync --upgrade
```

### Development Workflow

It's recommended to develop in your local environment (not container) since you can:
- See the browser window in real-time
- Use Playwright's debugging tools
- Avoid debugging via screenshots only

```bash
# Run tests in headed mode to see what's happening
uv run pytest --headed

# Use Playwright's debug mode
uv run pytest --headed --slowmo 1000

# Take screenshots on failure (automatic)
# Screenshots saved to test-results/
```

### Database Configuration

The tests connect to a MySQL database with these settings (in `testlibraries/config.py`):

```python
DATABASE_CONFIG = {
    "host": os.getenv("DATABASE_HOST", "localhost"),
    "port": 3306,
    "username": "exampleuser",
    "password": "examplepass",
    "database": "exampledb",
}
```

Modify these values in `config.py` or override via environment variables.

## Docker

### Building the Container

```bash
docker build -t staticpress-test .
```

### Running Tests in Docker

```bash
docker run --rm staticpress-test
```

The Dockerfile:
- Uses Playwright base image with Chromium dependencies
- Installs Python dependencies via uv
- Runs tests in headless mode

## WordPress Compatibility

The test suite handles multiple WordPress versions:
- **WordPress 5.4.2+**: Language chooser page support
- **WordPress 4.3+**: Legacy password input selectors
- **Modern WordPress**: Current heading tags and UI elements

## Basic Authentication

Tests support WordPress sites behind HTTP basic authentication:
- Default credentials: `authuser` / `authpassword`
- Configured in `conftest.py` via `browser_context_args` fixture

## Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Check DATABASE_HOST in .env file
# Ensure MySQL is running and accessible
```

**Playwright Installation Issues**
```bash
# Reinstall browsers with system dependencies
uv run playwright install --with-deps chromium
```

**Import Errors**
```bash
# Ensure all __init__.py files exist
# Run: uv sync
```

**Test Timeouts**
```bash
# Tests have a 5-minute timeout by default
# Increase in pytest.ini if needed
```

## Test Flow

1. **Session Setup** (`conftest.py` - runs once):
   - Navigate to WordPress
   - Handle language selection (if WordPress 5.4.2+)
   - Install WordPress or login
   - Activate StaticPress2019 plugin

2. **Before Each Test** (runs before every test):
   - Clean StaticPress options from database
   - Load fresh fixtures from YAML files

3. **Main Test** (`tests/test_all.py`):
   - Navigate to StaticPress options page
   - Configure static URL, directory, and timeout
   - Verify settings saved to database
   - Trigger static site rebuild
   - Verify rebuild output

## Contributing

1. Follow Python conventions (snake_case, PEP 8)
2. Add type hints to all functions
3. Update tests when adding new features
4. Run tests before committing: `uv run pytest`

## License

MIT

## Resources

- [uv Documentation](https://docs.astral.sh/uv/)
- [pytest Documentation](https://docs.pytest.org/)
- [Playwright Python](https://playwright.dev/python/)
- [SQLAlchemy 2.0](https://docs.sqlalchemy.org/en/20/)
- [pytest-playwright](https://github.com/microsoft/playwright-pytest)
