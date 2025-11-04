import 'reflect-metadata';
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './__tests__',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [ ['html', { open: 'never' }] ],
  timeout: 5 * 60 * 1000, // 5 minutes
  use: {
    baseURL: process.env.HOST || 'http://localhost/',
    screenshot: 'on',
    video: {
      mode: 'on',
      size: { width: 1920, height: 1080 }
    },
    httpCredentials: {
      username: 'authuser',
      password: 'authpassword'
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
        headless: process.env.HEADLESS === undefined || process.env.HEADLESS === 'true',
      },
    },
  ],
});
