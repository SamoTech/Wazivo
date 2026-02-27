import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('CV Upload Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display main page correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Wazivo');
    await expect(page.locator('text=Get Hired, Get Wazivo')).toBeVisible();
  });

  test('should switch between file and URL tabs', async ({ page }) => {
    // Default is file upload
    await expect(page.locator('text=Drag & drop your CV')).toBeVisible();

    // Switch to URL
    await page.click('button:has-text("URL")');
    await expect(page.locator('input[type="url"]')).toBeVisible();

    // Switch back to file
    await page.click('button:has-text("File Upload")');
    await expect(page.locator('text=Drag & drop your CV')).toBeVisible();
  });

  test('should validate URL input', async ({ page }) => {
    await page.click('button:has-text("URL")');
    
    // Enter invalid URL
    await page.fill('input[type="url"]', 'not-a-url');
    await expect(page.locator('text=valid URL')).toBeVisible();

    // Enter valid URL
    await page.fill('input[type="url"]', 'https://example.com/resume.pdf');
    await expect(page.locator('button:has-text("Analyze from URL")')).toBeEnabled();
  });

  test('should show LinkedIn warning', async ({ page }) => {
    await page.click('button:has-text("URL")');
    await page.fill('input[type="url"]', 'https://linkedin.com/in/test');
    
    await expect(page.locator('text=LinkedIn detected')).toBeVisible();
    await expect(page.locator('text=Save to PDF')).toBeVisible();
  });

  test('should handle file size validation', async ({ page }) => {
    // This would require creating a test file
    // Implementation depends on test file setup
  });
});
