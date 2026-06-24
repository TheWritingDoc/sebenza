const { test, expect } = require('@playwright/test');

function uniq(prefix = 'u') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@example.com`;
}

async function register(api, name, email, password = 'Passw0rd!') {
  const res = await api.post('http://127.0.0.1:3001/api/register', {
    data: { name, email, password }
  });
  expect([200, 201]).toContain(res.status());
}

async function login(page, email, password = 'Passw0rd!') {
  await page.goto('http://127.0.0.1:3001/login');
  await page.getByPlaceholder('you@example.com').fill(email);
  await page.getByPlaceholder('••••••••').fill(password);
  await page.getByRole('button', { name: /Sign In/i }).click();
  await expect(page.getByText(/Dashboard/i)).toBeVisible({ timeout: 20000 });
}

test.describe('GShop parallel browser stress', () => {
  test('two users repeatedly open/close details without runtime errors', async ({ browser, request }) => {
    const userA = { email: uniq('stressA'), name: `StressA_${Date.now()}` };
    const userB = { email: uniq('stressB'), name: `StressB_${Date.now()}` };

    await register(request, userA.name, userA.email);
    await register(request, userB.name, userB.email);

    const ctxA = await browser.newContext();
    const ctxB = await browser.newContext();
    const pageA = await ctxA.newPage();
    const pageB = await ctxB.newPage();

    const errors = [];
    const hookErrors = (page, label) => {
      page.on('pageerror', (e) => errors.push(`${label}:pageerror:${e.message}`));
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(`${label}:console:${msg.text()}`);
      });
    };

    hookErrors(pageA, 'A');
    hookErrors(pageB, 'B');

    await Promise.all([
      login(pageA, userA.email),
      login(pageB, userB.email)
    ]);

    await Promise.all([
      pageA.getByRole('button', { name: /Help Needed/i }).click(),
      pageB.getByRole('button', { name: /Help Needed/i }).click()
    ]);

    await Promise.all([
      expect(pageA.getByRole('heading', { name: /Community Help/i })).toBeVisible(),
      expect(pageB.getByRole('heading', { name: /Community Help/i })).toBeVisible()
    ]);

    // Stress loop: repeated open/close in both contexts
    for (let i = 0; i < 5; i++) {
      const btnA = pageA.getByRole('button', { name: /View Details/i }).first();
      const btnB = pageB.getByRole('button', { name: /View Details/i }).first();

      await Promise.all([btnA.click(), btnB.click()]);
      await Promise.all([
        expect(pageA.getByRole('button', { name: '←' }).first()).toBeVisible({ timeout: 10000 }),
        expect(pageB.getByRole('button', { name: '←' }).first()).toBeVisible({ timeout: 10000 })
      ]);

      await Promise.all([
        pageA.getByRole('button', { name: '←' }).first().click(),
        pageB.getByRole('button', { name: '←' }).first().click()
      ]);

      await Promise.all([
        expect(pageA.getByRole('heading', { name: /Community Help/i })).toBeVisible({ timeout: 10000 }),
        expect(pageB.getByRole('heading', { name: /Community Help/i })).toBeVisible({ timeout: 10000 })
      ]);
    }

    expect(errors, `Runtime errors found:\n${errors.join('\n')}`).toEqual([]);

    await ctxA.close();
    await ctxB.close();
  });
});
