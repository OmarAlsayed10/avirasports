import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  test('search overlay opens and closes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /open search/i }).click();
    await expect(page.getByRole('dialog', { name: /search products/i })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: /search products/i })).not.toBeVisible();
  });

  test('Ctrl+K opens search overlay', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+k');
    await expect(page.getByRole('dialog', { name: /search products/i })).toBeVisible();
  });

  test('shows no results message for unmatched query', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /open search/i }).click();
    const input = page.getByRole('searchbox', { name: /search/i });
    await input.fill('xyznonexistentproduct123');
    await page.waitForTimeout(400);
    await expect(page.getByText(/no results for/i)).toBeVisible();
  });

  test('stores recent search and displays it on reopen', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /open search/i }).click();
    const input = page.getByRole('searchbox', { name: /search/i });
    await input.fill('philips');
    await page.waitForTimeout(400);
    await page.keyboard.press('Enter');
    await page.waitForURL(/\/shop/);

    await page.goto('/');
    await page.getByRole('button', { name: /open search/i }).click();
    await expect(page.getByText('philips')).toBeVisible();
  });
});
