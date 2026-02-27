import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('should display error message for failed API call', async ({ page }) => {
    // Mock API to fail
    await page.route('**/api/analyze', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Analysis failed' }),
      });
    });

    await page.goto('/');
    
    // Try to upload
    await page.click('button:has-text("URL")');
    await page.fill('input[type="url"]', 'https://example.com/resume.pdf');
    await page.click('button:has-text("Analyze from URL")');

    // Should show error
    await expect(page.locator('text=Analysis failed')).toBeVisible();
  });

  test('should show rate limit message', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("URL")');

    // Make multiple requests quickly
    for (let i = 0; i < 6; i++) {
      await page.fill('input[type="url"]', `https://example.com/resume${i}.pdf`);
      await page.click('button:has-text("Analyze from URL")');
      await page.waitForTimeout(100);
    }

    // Should show rate limit error
    await expect(page.locator('text=Too many requests')).toBeVisible();
  });
});
