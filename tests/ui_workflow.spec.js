const { test, expect } = require('@playwright/test');

function uniqueEmail(prefix = 'pw') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@example.com`;
}

test.describe('GShop current UI workflow smoke', () => {
  test('login, open details, back closes panel, no console errors', async ({ page, request }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
    });

    const email = uniqueEmail('uiwalk');
    const password = 'Passw0rd!';

    const reg = await request.post('http://127.0.0.1:3001/api/register', {
      data: { name: 'UI Workflow Tester', email, password }
    });
    expect([200, 201]).toContain(reg.status());

    await page.goto('http://127.0.0.1:3001/login');
    await expect(page).toHaveTitle(/Ge-Shop|GShop/i);

    await page.getByPlaceholder('you@example.com').fill(email);
    await page.getByPlaceholder('••••••••').fill(password);
    await page.getByRole('button', { name: /Sign In/i }).click();

    await expect(page.getByText(/Dashboard/i)).toBeVisible({ timeout: 20000 });

    await page.getByRole('button', { name: /Help Needed/i }).click();
    await expect(page.getByRole('heading', { name: /Community Help/i })).toBeVisible();

    const detailsBtn = page.getByRole('button', { name: /View Details/i }).first();
    await expect(detailsBtn).toBeVisible({ timeout: 20000 });
    await detailsBtn.click();

    const backBtn = page.getByRole('button', { name: '←' }).first();
    await expect(backBtn).toBeVisible({ timeout: 10000 });
    await backBtn.click();

    await expect(page.getByRole('heading', { name: /Community Help/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /View Details/i }).first()).toBeVisible({ timeout: 10000 });

    expect(errors, `Runtime errors found:\n${errors.join('\n')}`).toEqual([]);
  });
});
