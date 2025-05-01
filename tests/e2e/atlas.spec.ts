import { test, expect } from '@playwright/test';

test('fetches atlas.webp on startup', async ({ page }) => {
	const responsePromise = page.waitForResponse(
		(resp) => resp.url().endsWith('atlas.webp') && resp.status() === 200
	);
	await page.goto('/');
	const response = await responsePromise;
	expect(response.ok()).toBeTruthy();
});
