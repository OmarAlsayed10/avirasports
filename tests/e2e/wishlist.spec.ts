import { test, expect } from '@playwright/test';

test.describe('Wishlist', () => {
  test('wishlist page shows empty state by default', async ({ page }) => {
    await page.goto('/wishlist');
    await expect(page.getByText(/your wishlist is empty/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /continue shopping/i })).toBeVisible();
  });

  test('empty state links to shop', async ({ page }) => {
    await page.goto('/wishlist');
    await page.getByRole('link', { name: /continue shopping/i }).click();
    await expect(page).toHaveURL(/\/shop/);
  });

  test('header wishlist icon links to wishlist page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /wishlist/i }).click();
    await expect(page).toHaveURL('/wishlist');
  });
});
