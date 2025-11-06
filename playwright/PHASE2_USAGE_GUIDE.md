# Phase 2 Usage Guide: Python Database Layer

This guide shows how to use the newly migrated database layer components in your Python code.

## Quick Start

### 1. Database Connection

```python
from testlibraries.config import get_db_connection
from sqlalchemy import text

# Execute a query
with get_db_connection() as conn:
    result = conn.execute(text("SELECT * FROM wp_options WHERE option_name = :name"),
                         {"name": "StaticPress::static url"})
    row = result.fetchone()
    print(row[0])  # Access by column index
```

### 2. Table Cleaner

```python
from testlibraries import TableCleaner

# Clean StaticPress options before test
TableCleaner.clean()
```

### 3. Fixture Loader

```python
from testlibraries import FixtureLoader

# Load test fixtures
FixtureLoader.load("./testlibraries/fixtures/WpOptionsStaticPress2019.yml")
```

## Common Patterns

### Pattern 1: Test Setup (pytest)

```python
import pytest
from testlibraries import TableCleaner, FixtureLoader

@pytest.fixture(autouse=True)
def setup_database_fixtures():
    """Setup fixtures before each test."""
    TableCleaner.clean()
    FixtureLoader.load("./testlibraries/fixtures/WpOptionsStaticPress2019.yml")
    yield
    # Cleanup if needed
```

### Pattern 2: Query and Assert

```python
from testlibraries.config import get_db_connection
from sqlalchemy import text

def test_option_saved():
    with get_db_connection() as conn:
        result = conn.execute(
            text("SELECT option_value FROM wp_options WHERE option_name = :name"),
            {"name": "StaticPress::static url"}
        )
        row = result.fetchone()
        assert row[0] == "http://example.org/sub/"
```

### Pattern 3: Insert/Update Data

```python
from testlibraries.config import get_db_connection
from sqlalchemy import text

with get_db_connection() as conn:
    # Insert or update
    conn.execute(
        text("""
            INSERT INTO wp_options (option_name, option_value, autoload)
            VALUES (:name, :value, :autoload)
            ON DUPLICATE KEY UPDATE option_value = VALUES(option_value)
        """),
        {
            "name": "my_option",
            "value": "my_value",
            "autoload": "yes"
        }
    )
    # Commit is automatic when exiting the context manager
```

### Pattern 4: Multiple Queries in Transaction

```python
from testlibraries.config import get_db_connection
from sqlalchemy import text

with get_db_connection() as conn:
    # All queries in same transaction
    conn.execute(text("DELETE FROM wp_options WHERE option_name = 'temp1'"))
    conn.execute(text("DELETE FROM wp_options WHERE option_name = 'temp2'"))
    conn.execute(text("DELETE FROM wp_options WHERE option_name = 'temp3'"))
    # All committed together when exiting
```

### Pattern 5: Error Handling

```python
from testlibraries.config import get_db_connection
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

try:
    with get_db_connection() as conn:
        result = conn.execute(text("SELECT * FROM wp_options"))
        # Process results...
except SQLAlchemyError as e:
    print(f"Database error: {e}")
    # Handle error
```

## API Reference

### `get_db_connection()`

Context manager that provides a database connection.

**Returns:** `sqlalchemy.engine.Connection`

**Example:**
```python
with get_db_connection() as conn:
    result = conn.execute(text("SELECT 1"))
```

**Behavior:**
- Creates engine and connection
- Automatically commits on success
- Automatically rolls back on exception
- Automatically closes connection and disposes engine

### `TableCleaner.clean()`

Deletes StaticPress options from `wp_options` table.

**Arguments:** None

**Returns:** None

**Deletes:**
- `StaticPress::static url`
- `StaticPress::static dir`
- `StaticPress::timeout`

**Example:**
```python
from testlibraries import TableCleaner

TableCleaner.clean()
```

### `FixtureLoader.load(fixtures_path)`

Loads fixtures into the database.

**Arguments:**
- `fixtures_path` (str): Path to YAML fixture file

**Returns:** None

**Supported Fixtures:**
- `WpOptionsStaticPress2019.yml` (or any path containing "WpOptionsStaticPress2019")

**Example:**
```python
from testlibraries import FixtureLoader

FixtureLoader.load("./testlibraries/fixtures/WpOptionsStaticPress2019.yml")
```

**Loaded Data:**
- `StaticPress::static url` = `http://example.org/sub/`
- `StaticPress::static dir` = `/var/www/web/static/`
- `StaticPress::timeout` = `20`

## Configuration

### Environment Variables

Set in `.env` file:

```env
DATABASE_HOST=localhost
```

### Database Parameters

Defined in [testlibraries/config.py](testlibraries/config.py):

```python
DATABASE_CONFIG = {
    "host": os.getenv("DATABASE_HOST", "localhost"),
    "port": 3306,
    "username": "exampleuser",
    "password": "examplepass",
    "database": "exampledb",
}
```

### Connection URL

Automatically generated:
```
mysql+pymysql://exampleuser:examplepass@localhost:3306/exampledb
```

## Testing Your Code

### Run Phase 2 Validation

```bash
uv run python test_database_layer.py
```

### Write Your Own Tests

```python
# tests/test_my_feature.py
from testlibraries import TableCleaner, FixtureLoader, get_db_connection
from sqlalchemy import text

def test_my_database_operation():
    # Setup
    TableCleaner.clean()
    FixtureLoader.load("./testlibraries/fixtures/WpOptionsStaticPress2019.yml")

    # Test
    with get_db_connection() as conn:
        result = conn.execute(
            text("SELECT option_value FROM wp_options WHERE option_name = :name"),
            {"name": "StaticPress::static url"}
        )
        row = result.fetchone()

    # Assert
    assert row[0] == "http://example.org/sub/"
```

## Migration from TypeScript

### TypeScript → Python Comparison

| TypeScript | Python |
|------------|--------|
| `const myDataSource = new DataSource(ormconfig)` | `with get_db_connection() as conn:` |
| `connection = await myDataSource.initialize()` | (handled by context manager) |
| `await connection.query("SELECT ...")` | `conn.execute(text("SELECT ..."))` |
| `await connection.destroy()` | (handled by context manager) |
| `TableCleaner.clean()` | `TableCleaner.clean()` |
| `FixtureLoader.load(path)` | `FixtureLoader.load(path)` |

### Key Differences

1. **No async/await:** Python version is synchronous
2. **Context managers:** Cleaner than try/finally blocks
3. **Parameterized queries:** Use dictionaries instead of positional args
4. **Type hints:** Similar to TypeScript types

## Troubleshooting

### "Module not found" error

```bash
# Ensure dependencies are installed
uv sync

# Ensure you're in the right directory
cd /workspace
```

### "Connection refused" error

```bash
# Check DATABASE_HOST in .env
cat .env | grep DATABASE_HOST

# Verify MySQL is running
# (depends on your setup)
```

### "Table doesn't exist" error

```bash
# Verify database has WordPress tables
uv run python -c "
from testlibraries.config import get_db_connection
from sqlalchemy import text
with get_db_connection() as conn:
    result = conn.execute(text('SHOW TABLES'))
    print([row[0] for row in result.fetchall()])
"
```

## Entity Models (Optional)

If you prefer ORM instead of raw queries:

```python
from testlibraries.entities import WpOption, Base
from testlibraries.config import DATABASE_URL, ENGINE_OPTIONS
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

# Create engine and session
engine = create_engine(DATABASE_URL, **ENGINE_OPTIONS)

with Session(engine) as session:
    # Query using ORM
    option = session.query(WpOption).filter_by(
        option_name="StaticPress::static url"
    ).first()

    print(option.option_value)
```

**Note:** Current implementation uses raw queries. ORM is available but not actively used.

## Best Practices

1. **Always use parameterized queries:** Prevents SQL injection
   ```python
   # Good
   conn.execute(text("SELECT * FROM wp_options WHERE option_name = :name"),
                {"name": user_input})

   # Bad
   conn.execute(text(f"SELECT * FROM wp_options WHERE option_name = '{user_input}'"))
   ```

2. **Use context managers:** Ensures cleanup
   ```python
   # Good
   with get_db_connection() as conn:
       result = conn.execute(text("SELECT 1"))

   # Bad
   conn = get_connection()
   result = conn.execute(text("SELECT 1"))
   conn.close()  # Easy to forget!
   ```

3. **One transaction per context:** Keep transactions short
   ```python
   # Good
   with get_db_connection() as conn:
       conn.execute(text("DELETE ..."))

   with get_db_connection() as conn:
       conn.execute(text("INSERT ..."))

   # Avoid long-running transactions
   ```

## Next Steps

With Phase 2 complete, you can:

1. Use these database utilities in Phase 5 (pytest fixtures)
2. Use them in Phase 6 (main test file)
3. Extend with additional entity models if needed
4. Add more fixture sets for different test scenarios

---

**Questions?** Refer to:
- [PHASE2_COMPLETION.md](PHASE2_COMPLETION.md) - Detailed completion report
- [MIGRATION_TO_PYTHON.md](MIGRATION_TO_PYTHON.md) - Full migration plan
- [testlibraries/config.py](testlibraries/config.py) - Source code with detailed docstrings
