import { test, expect, Page } from '@playwright/test';
import { loginDemoApp } from '../tests/fixtures/auth';
import  testData from '../tests/test-data.json' assert { type: 'json' };;

// Navigate to app (Web / Mobile)
async function goToApp(page, app: string) {
  const appButton = page.locator(`nav button:has(h2:has-text("${app}"))`);
  await appButton.click();
  await expect(page.locator(`h1:has-text("${app}")`)).toBeVisible();
}

  // Locate and verify column, task, tags
async function verifyTaskDetails(page, column: string, task: string, tags: string[]) {
  
  // Locate column by heading (e.g. "To Do", "In Progress", "Done")
  const columnLocator = page.locator(`h2:has-text("${column}")`).locator('..'); // parent div

  // Verify correct column name
  await expect(columnLocator.locator('h2')).toHaveText(new RegExp(`^${column}`));

  // Find the specific task card inside this column
  const taskCard = columnLocator.locator(`h3:has-text("${task}")`);

  // Verify task text
  await expect(taskCard).toHaveText(new RegExp(task, 'i'));

  // Verify all expected tags exist
  for (const tag of tags) {
    const tagLocator = columnLocator.locator(`span:has-text("${tag}")`);
    await expect(tagLocator).toBeVisible();
  }
}
test.describe('Data-driven Board Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginDemoApp(page);
  });
// Data-driven loop
  for (const { app, task, column, tags } of testData) {
    test(`Verify task "${task}" in ${app}`, async ({ page }) => {
      await goToApp(page, app);
      await verifyTaskDetails(page, column, task, tags);
    });
  }
});