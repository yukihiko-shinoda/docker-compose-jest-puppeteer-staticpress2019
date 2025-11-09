FROM futureys/claude-code-playwright-python:20251109015000
COPY . /workspace
RUN uv sync --no-dev \
# Install Playwright browsers
 && uv run playwright install --with-deps chromium
CMD ["uv", "run", "pyetest", "tests/test_all.py", "-v"]
