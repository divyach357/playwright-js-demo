import { Page } from '@playwright/test';

export async function loginDemoApp(page: Page) {
  await page.goto('/');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'password123');
  await page.click('text=Sign in');
  await page.waitForSelector('h1:text("Projects")');

}