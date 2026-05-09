import { test, expect } from '@playwright/test';

test.describe('Checkout — Pay at Fawry', () => {
  test.beforeEach(async ({ page }) => {
    // Add a product to cart first
    await page.goto('/shop');
    await page.locator('article button[aria-label*="Add"]').first().click();
    await page.getByRole('button', { name: 'Close cart' }).click();
  });

  test('checkout page renders with cart items', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
    await expect(page.getByText('Order Summary')).toBeVisible();
  });

  test('step 1 validates required fields', async ({ page }) => {
    await page.goto('/checkout');
    // Click continue without filling in fields
    await page.getByRole('button', { name: /Continue to Shipping/i }).click();
    // Form errors should appear (RHF validation)
    // The form should still be on step 1
    await expect(page.getByRole('heading', { name: 'Contact & Shipping' })).toBeVisible();
  });

  test('can progress through steps', async ({ page }) => {
    await page.goto('/checkout');
    // Fill step 1
    await page.fill('input[placeholder="Mohamed Ahmed"]', 'Test User');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[placeholder="01xxxxxxxxx"]', '01012345678');
    await page.fill('input[placeholder*="Street"]', '123 Test Street');
    await page.fill('input[placeholder="Cairo"]', 'Cairo');
    await page.selectOption('select', 'Cairo');
    await page.getByRole('button', { name: /Continue to Shipping/i }).click();

    // Should see step 2
    await expect(page.getByRole('heading', { name: 'Shipping Method' })).toBeVisible();
  });

  test('empty cart redirects away from checkout', async ({ page }) => {
    // Clear storage first
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto('/checkout');
    // Should show empty cart message
    await expect(page.getByText(/Your cart is empty/i)).toBeVisible();
  });
});
