import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:4399' },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4399',
    url: 'http://localhost:4399',
    reuseExistingServer: !process.env.CI,
    env: { PUBLIC_CONTACT_ENDPOINT: 'https://contact.test/send' },
    timeout: 120_000,
  },
})
