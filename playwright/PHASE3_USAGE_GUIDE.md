# Phase 3 Usage Guide: RoutineOperation Utilities

This guide shows how to use the RoutineOperation utility class for XPath-based element interactions in Playwright.

## Quick Start

### Import

```python
from testlibraries import RoutineOperation
# OR
from testlibraries.routine_operation import RoutineOperation
```

### Basic Click by Text

```python
from playwright.sync_api import Page
from testlibraries import RoutineOperation

def test_navigation(page: Page):
    # Click a link with text "Log In"
    RoutineOperation.click_by_text(page, 'a', 'Log In')

    # Click a button with text "Submit"
    RoutineOperation.click_by_text(page, 'button', 'Submit')

    # Click any element with specific text
    RoutineOperation.click_by_text(page, 'span', 'Click Here')
```

### Escape XPath Strings

```python
from testlibraries import RoutineOperation

# Simple text
escaped = RoutineOperation.escape_xpath_string("Hello World")
# → "concat('Hello World', '')"

# Text with quotes
escaped = RoutineOperation.escape_xpath_string("It's working")
# → "concat('It', \"'\", 's working', '')"
```

## Common Patterns

### Pattern 1: Click Menu Items

```python
from playwright.sync_api import Page
from testlibraries import RoutineOperation

def navigate_to_plugins(page: Page):
    """Navigate to WordPress plugins page."""
    # Click "Plugins" menu
    RoutineOperation.click_by_text(page, 'a', 'Plugins')
    page.wait_for_load_state('networkidle')
```

### Pattern 2: Click Buttons with Quotes

```python
from testlibraries import RoutineOperation

# Button text contains single quote
RoutineOperation.click_by_text(page, 'button', "Don't Show Again")

# Link text with apostrophe
RoutineOperation.click_by_text(page, 'a', "User's Profile")
```

### Pattern 3: Custom XPath Construction

```python
from testlibraries import RoutineOperation

# Escape text for custom XPath
text = "StaticPress2019 Options"
escaped = RoutineOperation.escape_xpath_string(text)

# Build custom XPath selector
xpath = f'//div[@class="menu-name" and contains(text(), {escaped})]'

# Use with Playwright
locator = page.locator(f'xpath=.{xpath}')
locator.click()
```

### Pattern 4: Multiple Element Selection

```python
from testlibraries import RoutineOperation

def click_all_edit_links(page: Page):
    """Click all 'Edit' links on a page."""
    # Note: click_by_text clicks the FIRST match
    # For multiple elements, build the XPath manually

    escaped = RoutineOperation.escape_xpath_string("Edit")
    xpath = f'xpath=.//a[contains(text(), {escaped})]'

    # Get all matching elements
    elements = page.locator(xpath).all()

    # Click each one
    for element in elements:
        element.click()
```

### Pattern 5: Verify Text Exists

```python
from testlibraries import RoutineOperation

def verify_message_shown(page: Page, message: str):
    """Verify a message is displayed on the page."""
    escaped = RoutineOperation.escape_xpath_string(message)
    xpath = f'xpath=.//*[contains(text(), {escaped})]'

    # Check if element exists
    locator = page.locator(xpath)
    assert locator.count() > 0, f"Message '{message}' not found"
```

## API Reference

### `RoutineOperation.click_by_text(page, tag, text)`

Click an element by tag and text content.

**Parameters:**
- `page` (Page): Playwright Page object
- `tag` (str): HTML tag name ('a', 'button', 'div', etc.)
- `text` (str): Text content to search for

**Returns:** None

**Raises:**
- `TimeoutError`: If element not found within timeout
- `Error`: If multiple elements match and first is not clickable

**Example:**
```python
# Click link
RoutineOperation.click_by_text(page, 'a', 'Click Here')

# Click button
RoutineOperation.click_by_text(page, 'button', 'Submit')

# Click span
RoutineOperation.click_by_text(page, 'span', 'Read More')
```

**Generated XPath:**
```
xpath=.//{tag}[contains(text(), {escaped_text})]
```

**Notes:**
- Clicks the **first** matching element (uses `.first`)
- Text is automatically escaped for XPath safety
- Uses `contains()` so matches partial text
- Auto-waits for element to be clickable (Playwright default)

### `RoutineOperation.escape_xpath_string(text)`

Escape a string for safe use in XPath 1.0 expressions.

**Parameters:**
- `text` (str): String to escape

**Returns:** str - Escaped string as `concat()` expression

**Example:**
```python
# No quotes
RoutineOperation.escape_xpath_string("Hello")
# → "concat('Hello', '')"

# With quote
RoutineOperation.escape_xpath_string("It's")
# → "concat('It', \"'\", 's', '')"

# Multiple quotes
RoutineOperation.escape_xpath_string("That's Joe's")
# → "concat('That', \"'\", 's Joe', \"'\", 's', '')"
```

**Why concat()?**

XPath 1.0 doesn't support escaping quotes in string literals. The `concat()` function works around this by splitting the string at quote boundaries.

**Algorithm:**
1. Replace each `'` with `', "'", '`
2. Wrap in `concat('...', '')`

## Real-World WordPress Examples

### Example 1: Navigate WordPress Admin

```python
from playwright.sync_api import Page
from testlibraries import RoutineOperation

def navigate_wordpress_admin(page: Page):
    """Navigate WordPress admin menu structure."""
    # Click Settings menu
    RoutineOperation.click_by_text(page, 'a', 'Settings')

    # Click submenu item
    RoutineOperation.click_by_text(page, 'a', 'General')

    # Click Save button
    RoutineOperation.click_by_text(page, 'input', 'Save Changes')
```

### Example 2: Activate Plugin

```python
from playwright.sync_api import Page
from testlibraries import RoutineOperation

def activate_plugin(page: Page, plugin_name: str):
    """Activate a WordPress plugin by name."""
    # Navigate to Plugins page
    RoutineOperation.click_by_text(page, 'a', 'Plugins')
    page.wait_for_load_state('networkidle')

    # Click Activate link for the plugin
    # (Assumes plugin row contains plugin name)
    RoutineOperation.click_by_text(page, 'a', 'Activate')
```

### Example 3: WordPress Login Flow

```python
from playwright.sync_api import Page
from testlibraries import RoutineOperation

def wordpress_login(page: Page, username: str, password: str):
    """Complete WordPress login flow."""
    # Go to login page
    page.goto('http://localhost/wp-admin/')

    # Fill credentials
    page.fill('#user_login', username)
    page.fill('#user_pass', password)

    # Click login button (text might vary)
    RoutineOperation.click_by_text(page, 'input', 'Log In')

    # Wait for dashboard
    page.wait_for_load_state('networkidle')
```

### Example 4: StaticPress Operations

```python
from playwright.sync_api import Page
from testlibraries import RoutineOperation

def navigate_staticpress_options(page: Page):
    """Navigate to StaticPress options page."""
    # Hover over StaticPress menu (custom logic in page object)
    # ...

    # Click submenu
    RoutineOperation.click_by_text(page, 'a', 'StaticPress2019 Options')
    page.wait_for_load_state('networkidle')

def trigger_rebuild(page: Page):
    """Trigger StaticPress rebuild."""
    # Navigate to rebuild page
    RoutineOperation.click_by_text(page, 'a', 'StaticPress2019')

    # Click rebuild button
    RoutineOperation.click_by_text(page, 'a', 'Rebuild')
```

## Edge Cases and Tips

### Handling Ambiguous Text

```python
# Problem: Multiple elements with same text
# Solution: Be more specific with tag or use custom XPath

# Generic (clicks first match)
RoutineOperation.click_by_text(page, 'a', 'Edit')

# More specific
RoutineOperation.click_by_text(page, 'a', 'Edit Post')

# Custom XPath for even more specificity
escaped = RoutineOperation.escape_xpath_string('Edit')
xpath = f'//tr[@id="post-123"]//a[contains(text(), {escaped})]'
page.locator(f'xpath=.{xpath}').click()
```

### Exact Text Match

```python
# click_by_text uses contains() - matches partial text
# For exact match, use custom XPath

escaped = RoutineOperation.escape_xpath_string('Submit')

# Partial match (contains)
xpath1 = f'//button[contains(text(), {escaped})]'

# Exact match
xpath2 = f'//button[text()={escaped}]'

page.locator(f'xpath=.{xpath2}').click()
```

### Case Sensitivity

```python
# XPath is case-sensitive by default
RoutineOperation.click_by_text(page, 'a', 'submit')  # Won't match "Submit"

# For case-insensitive, use translate() in XPath
escaped = RoutineOperation.escape_xpath_string('submit')
xpath = f'''//a[contains(
    translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),
    {escaped.lower()}
)]'''
page.locator(f'xpath=.{xpath}').click()
```

### Whitespace Handling

```python
# XPath preserves whitespace
RoutineOperation.click_by_text(page, 'a', 'Log  In')  # Two spaces - won't match "Log In"

# To normalize whitespace, use normalize-space() in XPath
escaped = RoutineOperation.escape_xpath_string('Log In')
xpath = f'//a[contains(normalize-space(text()), {escaped})]'
page.locator(f'xpath=.{xpath}').click()
```

## Troubleshooting

### "Element not found" Error

```python
# Problem: Element doesn't exist or text doesn't match
# Solutions:

# 1. Check the exact text (case-sensitive!)
page.screenshot(path='debug.png')  # Take screenshot to see page

# 2. Verify tag is correct
# Wrong: RoutineOperation.click_by_text(page, 'button', 'Submit')
# Right: RoutineOperation.click_by_text(page, 'input', 'Submit')

# 3. Wait for element to appear
page.wait_for_selector('xpath=.//a[contains(text(), "Log In")]')
RoutineOperation.click_by_text(page, 'a', 'Log In')
```

### "Element is not clickable" Error

```python
# Problem: Element exists but not visible/clickable
# Solutions:

# 1. Wait for load state
page.wait_for_load_state('networkidle')
RoutineOperation.click_by_text(page, 'a', 'Submit')

# 2. Scroll element into view
escaped = RoutineOperation.escape_xpath_string('Submit')
locator = page.locator(f'xpath=.//button[contains(text(), {escaped})]').first
locator.scroll_into_view_if_needed()
locator.click()

# 3. Wait for element to be clickable
locator.wait_for(state='visible')
locator.click()
```

### Quote Escaping Not Working

```python
# Problem: String with quotes not found
# Solution: Verify you're using escape_xpath_string()

# Wrong:
text = "It's working"
page.locator(f"xpath=.//a[contains(text(), '{text}')]").click()  # ❌ Syntax error

# Right:
text = "It's working"
escaped = RoutineOperation.escape_xpath_string(text)
page.locator(f"xpath=.//a[contains(text(), {escaped})]").click()  # ✅ Works

# Even better:
RoutineOperation.click_by_text(page, 'a', "It's working")  # ✅ Automatic escaping
```

## Testing Your Code

### Unit Test Example

```python
import pytest
from playwright.sync_api import Page
from testlibraries import RoutineOperation

def test_escape_xpath_string():
    """Test XPath escaping."""
    # Simple string
    assert RoutineOperation.escape_xpath_string("Hello") == "concat('Hello', '')"

    # String with quote
    assert RoutineOperation.escape_xpath_string("It's") == "concat('It', \"'\", 's', '')"

def test_click_by_text(page: Page):
    """Test clicking by text."""
    # Setup test page
    page.set_content('''
        <html>
            <body>
                <a href="#" onclick="window.clicked=true">Click Me</a>
            </body>
        </html>
    ''')

    # Click the link
    RoutineOperation.click_by_text(page, 'a', 'Click Me')

    # Verify it was clicked
    assert page.evaluate('window.clicked') == True
```

### Integration Test Example

```python
from playwright.sync_api import Page
from testlibraries import RoutineOperation

def test_wordpress_navigation(page: Page):
    """Test navigating WordPress admin."""
    # Login
    page.goto('http://localhost/wp-admin/')
    # ... login logic ...

    # Navigate using RoutineOperation
    RoutineOperation.click_by_text(page, 'a', 'Plugins')
    page.wait_for_load_state('networkidle')

    # Verify we're on plugins page
    assert 'plugins.php' in page.url
```

## Migration from TypeScript

### TypeScript → Python Comparison

| TypeScript | Python |
|------------|--------|
| `RoutineOperation.escapeXpathString("text")` | `RoutineOperation.escape_xpath_string("text")` |
| `await RoutineOperation.clickByText(page, 'a', 'text')` | `RoutineOperation.click_by_text(page, 'a', 'text')` |
| `page.locator(...).first()` | `page.locator(...).first` (property) |
| Template literals: `` `xpath=.//${tag}` `` | f-strings: `f"xpath=.//{tag}"` |

### Example Migration

**Before (TypeScript):**
```typescript
import RoutineOperation from "../RoutineOperation";

const escaped = RoutineOperation.escapeXpathString(menuText);
await RoutineOperation.clickByText(page, 'a', 'Log In');
```

**After (Python):**
```python
from testlibraries import RoutineOperation

escaped = RoutineOperation.escape_xpath_string(menu_text)
RoutineOperation.click_by_text(page, 'a', 'Log In')
```

## Best Practices

1. **Use `click_by_text()` for simple cases:**
   ```python
   # Good
   RoutineOperation.click_by_text(page, 'a', 'Submit')

   # Overkill
   escaped = RoutineOperation.escape_xpath_string('Submit')
   page.locator(f'xpath=.//a[contains(text(), {escaped})]').first.click()
   ```

2. **Escape when building custom XPath:**
   ```python
   # Always escape user input or dynamic text
   text = user_input  # Could contain quotes!
   escaped = RoutineOperation.escape_xpath_string(text)
   xpath = f'//div[contains(text(), {escaped})]'
   ```

3. **Be specific with tags:**
   ```python
   # Vague
   RoutineOperation.click_by_text(page, 'div', 'Click')  # Too generic

   # Specific
   RoutineOperation.click_by_text(page, 'button', 'Click')  # Better
   ```

4. **Handle timing properly:**
   ```python
   # After navigation, wait for page
   RoutineOperation.click_by_text(page, 'a', 'Next Page')
   page.wait_for_load_state('networkidle')
   ```

## Next Steps

With Phase 3 complete, you can:

1. Use `RoutineOperation` in Phase 4 (Page Objects)
2. Build page object methods using these utilities
3. Create reusable navigation helpers
4. Test WordPress admin interactions

---

**Questions?** Refer to:
- [PHASE3_COMPLETION.md](PHASE3_COMPLETION.md) - Detailed completion report
- [test_routine_operation.py](test_routine_operation.py) - 40+ test examples
- [testlibraries/routine_operation.py](testlibraries/routine_operation.py) - Source code with docstrings
