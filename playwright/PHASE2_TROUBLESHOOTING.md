# Phase 2 Troubleshooting Guide

## Issue: `uv sync` Failed with Python 3.14

### Problem

When running `uv sync`, the build failed with the following error:

```
× Failed to build `untokenize==0.1.1`
├─▶ The build backend returned an error
╰─▶ Call to `setuptools.build_meta:__legacy__.build_wheel` failed
    AttributeError: 'Constant' object has no attribute 's'
```

### Root Cause

The dependency chain was:
- `staticpressintegrationtest` → `docformatter` (dev dependency)
- `docformatter` → `untokenize>=0.1.1,<0.2.0`
- `untokenize==0.1.1` is **not compatible with Python 3.14**

By default, `uv` installed Python 3.14.0 (the latest available version), but `untokenize` is a legacy package that hasn't been updated for Python 3.14's AST changes.

### Solution

Constrained the Python version in [pyproject.toml](pyproject.toml) to avoid Python 3.14:

```toml
requires-python = ">=3.10,<3.14"
```

This tells `uv` to use Python 3.10-3.13, which are well-supported by all dependencies.

### Result

After the constraint was added:
- `uv sync` successfully installed Python 3.13.9
- All 120 packages installed successfully
- Database layer tests pass

### Verification

```bash
# Check Python version
uv run python --version
# Output: Python 3.13.9

# Verify dependencies installed
uv sync
# Output: Resolved 121 packages... Installed 120 packages

# Run validation tests
uv run python test_database_layer.py
# Output: ✓ Database layer tests completed!
```

## Current Status

✅ **RESOLVED** - Using Python 3.13.9

All Phase 2 components are working correctly:
- Database connection via SQLAlchemy
- TableCleaner utility
- FixtureLoader utility
- Entity models (WpOption, WpPost, WpUser)

## Future Considerations

### When to Update to Python 3.14

Wait until these conditions are met:
1. `untokenize` releases a Python 3.14-compatible version, OR
2. `docformatter` removes the `untokenize` dependency, OR
3. The project removes `docformatter` from dev dependencies

Monitor these issues:
- Check `untokenize` releases: https://pypi.org/project/untokenize/
- Check `docformatter` releases: https://pypi.org/project/docformatter/

### Alternative: Replace docformatter

If Python 3.14 support is needed urgently, consider:

**Option 1:** Remove `docformatter` from dev dependencies
```toml
# Remove or comment out in pyproject.toml
# "docformatter[tomli]; python_version < '3.11'",
# "docformatter; python_version >= '3.11'",
```

**Option 2:** Use alternative formatters
- `black` - Modern Python formatter (already using for this codebase style)
- `ruff format` - Faster alternative to Black

**Option 3:** Pin docformatter to a specific version
```toml
"docformatter>=1.8.0",  # When newer version is available
```

## Testing After Changes

If you modify Python version constraints:

```bash
# Remove existing venv
rm -rf .venv

# Re-sync with new constraints
uv sync

# Verify installation
uv run python test_database_layer.py
```

## Related Files

- [pyproject.toml](pyproject.toml) - Python version constraint (line 67)
- [test_database_layer.py](test_database_layer.py) - Validation script
- [PHASE2_COMPLETION.md](PHASE2_COMPLETION.md) - Phase 2 completion report

## Summary

| Item | Status |
|------|--------|
| Python Version | 3.13.9 ✅ |
| `uv sync` | Working ✅ |
| Dependencies | All installed (120 packages) ✅ |
| Database Layer | Fully functional ✅ |
| Tests | Passing ✅ |

---

**Last Updated:** 2025-11-06
**Python Version:** 3.13.9
**UV Version:** Latest
