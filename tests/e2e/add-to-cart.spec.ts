import { test, expect } from '@playwright/test';

test.describe('Product Page & Add to Cart', () => {
  test('product page loads', async ({ page }) => {
    // Navigate to shop first to find a product
    await page.goto('/shop');
    const firstCard = page.locator('article').first();
    await firstCard.waitFor({ state: 'visible' });
    const productLink = firstCard.locator('a').first();
    await productLink.click();
    await expect(page).toHaveURL(/\/product\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('quantity selector increments and decrements', async ({ page }) => {
    await page.goto('/shop');
    const firstCard = page.locator('article').first();
    await firstCard.locator('a').first().click();

    const quantityInput = page.getByLabel('Quantity value');
    await expect(quantityInput).toHaveValue('1');

    await page.getByLabel('Increase quantity').click();
    await expect(quantityInput).toHaveValue('2');

    await page.getByLabel('Decrease quantity').click();
    await expect(quantityInput).toHaveValue('1');
  });

  test('quantity selector does not go below 1', async ({ page }) => {
    await page.goto('/shop');
    await page.locator('article a').first().click();

    const decrementBtn = page.getByLabel('Decrease quantity');
    await expect(decrementBtn).toBeDisabled();
  });

  test('add to cart opens drawer and updates badge', async ({ page }) => {
    await page.goto('/shop');
    await page.locator('article a').first().click();

    const addBtn = page.getByRole('button', { name: /Add to Cart/i });
    await addBtn.click();

    // Drawer should open
    await expect(page.getByRole('dialog', { name: 'Shopping cart' })).toBeVisible();

    // Badge on cart icon should show at least 1
    await page.getByRole('button', { name: 'Close cart' }).click();
    const badge = page.locator('button[aria-label*="Open cart"] span');
    await expect(badge).toBeVisible();
  });

  test('continue shopping closes drawer', async ({ page }) => {
    await page.goto('/shop');
    await page.locator('article a').first().click();
    await page.getByRole('button', { name: /Add to Cart/i }).click();
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(page.getByRole('dialog', { name: 'Shopping cart' })).not.toBeVisible();
  });
});
