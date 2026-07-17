import { expect, test } from '@playwright/test'

test('home renders hero and nav works', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Building for the web')
  await page.getByRole('link', { name: 'Blog' }).click()
  await expect(page).toHaveURL(/\/blog\/?$/)
})

test('blog shows both bylines and filters by author', async ({ page }) => {
  await page.goto('/blog')
  await expect(page.getByText('Michael Hospedales').first()).toBeVisible()
  await expect(page.getByText('The Spark').first()).toBeVisible()
  // Scoped to the author-filter nav: a real post titled "Hello — I am The Spark" also
  // produces a link whose accessible name contains "The Spark" as a substring, which
  // otherwise trips Playwright's strict-mode ambiguity check against the unscoped locator.
  await page
    .getByRole('navigation', { name: 'Filter by author' })
    .getByRole('link', { name: 'The Spark' })
    .click()
  await expect(page).toHaveURL(/\/blog\/by\/spark/)
  await expect(page.getByRole('article').first()).toContainText('The Spark')
})

test('spark post carries attribution banner; michael post does not', async ({ page }) => {
  await page.goto('/blog/hello-from-the-spark')
  await expect(page.getByRole('complementary', { name: 'AI authorship disclosure' })).toBeVisible()
  await page.goto('/blog/a-new-coat-of-paint')
  await expect(page.getByRole('complementary', { name: 'AI authorship disclosure' })).toHaveCount(0)
})

test('contact form submits to endpoint and confirms', async ({ page }) => {
  await page.route('https://contact.test/**', (route) => route.fulfill({ json: { ok: true } }))
  await page.goto('/contact')
  await page.getByLabel('Name').fill('Test Person')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Message').fill('Hello from the smoke test suite.')
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByRole('status')).toContainText('Sent — thanks')
})

test('404 page renders', async ({ page }) => {
  const response = await page.goto('/definitely-not-a-page')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('swam away')
})

test('contact form surfaces server error message', async ({ page }) => {
  await page.route('https://contact.test/**', (route) =>
    route.fulfill({ status: 400, json: { error: 'Please provide a valid email address.' } }),
  )
  await page.goto('/contact')
  await page.getByLabel('Name').fill('Test Person')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Message').fill('Hello from the smoke test suite.')
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByRole('status')).toContainText('Please provide a valid email address.')
})
