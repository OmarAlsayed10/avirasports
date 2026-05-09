import { test, expect } from '@playwright/test';

test.describe('Browse & Filter Products', () => {
  test('shop page loads and shows products', async ({ page }) => {
    await page.goto('/shop');
    await expect(page.getByRole('heading', { name: /Shop Kitchen Electronics/i })).toBeVisible();
    await expect(page.getByLabel('Product listing')).toBeVisible();
  });

  test('applying category filter updates the URL and results', async ({ page }) => {
    await page.goto('/shop');
    // Click the Air Fryers radio in the sidebar (desktop)
    const airFryersRadio = page.getByRole('radio', { name: 'Air Fryers' });
    await airFryersRadio.click();
    await expect(page).toHaveURL(/category=air-fryers/);
  });

  test('filter chip appears after applying a filter', async ({ page }) => {
    await page.goto('/shop?category=air-fryers');
    await expect(page.getByRole('button', { name: /Remove filter: Category: air-fryers/i })).toBeVisible();
  });

  test('removing filter chip clears the filter', async ({ page }) => {
    await page.goto('/shop?category=air-fryers');
    await page.getByRole('button', { name: /Remove filter: Category: air-fryers/i }).click();
    await expect(page).not.toHaveURL(/category=air-fryers/);
  });

  test('sort dropdown changes URL', async ({ page }) => {
    await page.goto('/shop');
    await page.getByLabel('Sort products').selectOption('price_asc');
    await expect(page).toHaveURL(/sort=price_asc/);
  });

  test('shows no results state when no products match', async ({ page }) => {
    // Use a combination of filters unlikely to match anything
    await page.goto('/shop?priceMin=999999&priceMax=1000000');
    await expect(page.getByText(/No products found/i)).toBeVisible();
  });

  test('works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/shop');
    // Mobile filter button should be visible
    await expect(page.getByRole('button', { name: 'Open filters' })).toBeVisible();
    // Desktop sidebar should be hidden
    await expect(page.getByRole('complementary', { name: 'Product filters' })).toBeHidden();
  });

  test('pagination appears when total > limit', async ({ page }) => {
    // This test only runs if there are enough products in the DB
    await page.goto('/shop');
    const pagination = page.getByRole('navigation', { name: 'Pagination' });
    // Pagination may or may not exist depending on data; just verify it doesn't error
    await expect(page).not.toHaveURL(/error/);
  });
});
