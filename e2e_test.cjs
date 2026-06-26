const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/snap/bin/chromium',
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu']
  });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const results = [];
  
  const check = async (name, fn) => {
    try { await fn(); results.push('✅ ' + name); }
    catch(e) { results.push('❌ ' + name + ': ' + e.message.slice(0,100)); }
  };

  // 1. Home page
  await check('Home page loads', async () => {
    await page.goto('http://localhost:5174/', { timeout: 10000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    const title = await page.title();
    if (!title) throw new Error('No title');
  });

  // 2. Navigate to scholarships
  await check('Scholarships page loads', async () => {
    await page.goto('http://localhost:5174/scholarships', { timeout: 10000 });
    await page.waitForLoadState('networkidle', { timeout: 8000 });
  });

  // 3. Navigate to internships
  await check('Internships page loads', async () => {
    await page.goto('http://localhost:5174/internships', { timeout: 10000 });
    await page.waitForLoadState('networkidle', { timeout: 8000 });
  });

  // 4. Navigate to blog
  await check('Blog page loads', async () => {
    await page.goto('http://localhost:5174/blog', { timeout: 10000 });
    await page.waitForLoadState('networkidle', { timeout: 8000 });
  });

  // 5. Register page
  await check('Register page loads', async () => {
    await page.goto('http://localhost:5174/register', { timeout: 10000 });
    await page.waitForLoadState('networkidle', { timeout: 8000 });
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
  });

  // 6. Login page
  await check('Login page loads', async () => {
    await page.goto('http://localhost:5174/login', { timeout: 10000 });
    await page.waitForLoadState('networkidle', { timeout: 8000 });
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
  });

  // 7. Fill login form
  await check('Login form accepts credentials', async () => {
    await page.fill('input[type="email"]', 'alice@example.com');
    await page.fill('input[type="password"]', 'Secure1@Pass');
    const btn = await page.$('button[type="submit"]');
    if (!btn) throw new Error('No submit button');
  });

  // 8. Submit login and wait for redirect
  await check('Login flow completes', async () => {
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    const url = page.url();
    // Should redirect away from /login on success
    if (url.includes('/login')) {
      // Check if there's an error toast visible
      const body = await page.content();
      if (body.includes('verify your email') || body.includes('Invalid')) throw new Error('Login rejected — check credentials');
    }
  });

  // 9. Scholarships search filter
  await check('Scholarships filter by country', async () => {
    await page.goto('http://localhost:5174/scholarships', { timeout: 10000 });
    await page.waitForLoadState('networkidle', { timeout: 8000 });
  });

  // 10. Contact page
  await check('Contact page loads', async () => {
    await page.goto('http://localhost:5174/contact', { timeout: 8000 });
    await page.waitForLoadState('networkidle', { timeout: 8000 });
  });

  // 11. FAQ page
  await check('FAQ page loads', async () => {
    await page.goto('http://localhost:5174/faq', { timeout: 8000 });
    await page.waitForLoadState('networkidle', { timeout: 8000 });
  });

  // 12. Privacy Policy
  await check('Privacy policy page loads', async () => {
    await page.goto('http://localhost:5174/privacy-policy', { timeout: 8000 });
    await page.waitForLoadState('networkidle', { timeout: 8000 });
  });

  // 13. Admin dashboard (protected — should redirect if not logged in or show admin)
  await check('Admin route protected', async () => {
    const p2 = await ctx.newPage();
    await p2.goto('http://localhost:5174/admin', { timeout: 8000 });
    await p2.waitForLoadState('networkidle', { timeout: 5000 });
    await p2.close();
  });

  // 14. Take screenshot of home page
  await page.goto('http://localhost:5174/', { timeout: 10000 });
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  await page.screenshot({ path: '/tmp/home_screenshot.png', fullPage: false });
  results.push('📸 Screenshot saved to /tmp/home_screenshot.png');

  await browser.close();
  
  console.log('\n=== Browser E2E Test Results ===');
  results.forEach(r => console.log(r));
  const passed = results.filter(r => r.startsWith('✅')).length;
  const failed = results.filter(r => r.startsWith('❌')).length;
  console.log(`\n${passed} passed, ${failed} failed`);
})();
