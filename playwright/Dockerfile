FROM futureys/claude-code-python-development:20251026170000
# This file is based on Dockerfile of Playwright project for CI.
# @see https://playwright.dev/docs/ci
# Install dependencies for Playwright browsers
# build-essential: when npm ci, make command was required.
# @see https://superuser.com/questions/1331936/how-can-i-get-past-a-repository-is-not-signed-message-when-attempting-to-upgr/1331948#1331948
RUN apt-get update --allow-unauthenticated --allow-insecure-repositories && \
    apt-get -y install build-essential xvfb libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
      libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 \
      libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
      libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 \
      libxtst6 ca-certificates fonts-liberation libnss3 lsb-release xdg-utils wget \
      # To record videos
      ffmpeg \
 && rm -rf /var/lib/apt/lists/*

# If running Docker >= 1.13.0 use docker run's --init arg to reap zombie processes, otherwise
# uncomment the following lines to have `dumb-init` as PID 1
# ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
# RUN chmod +x /usr/local/bin/dumb-init
# ENTRYPOINT ["dumb-init", "--"]

WORKDIR /workspace
COPY . /workspace
RUN npm ci --only=production

# Install Playwright browsers
RUN npx playwright install --with-deps chromium

# # Run everything after as non-privileged user.
# USER pwuser
CMD ["npm", "test"]