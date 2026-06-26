const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/snap/bin/chromium',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1280,800',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  const results = [];

  const check = async (name, fn) => {
    try { await fn(); results.push('✅ ' + name); }
    catch(e) { results.push('❌ ' + name + ': ' + e.message.slice(0, 120)); }
  };

  // Home page
  await check('Home page loads', async () => {
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0', timeout: 15000 });
    const title = await page.title();
    if (!title) throw new Error('No page title');
  });
  await page.screenshot({ path: '/tmp/01_home.png', fullPage: false });

  // Scholarships listing
  await check('Scholarships page loads + has content', async () => {
    await page.goto('http://localhost:5174/scholarships', { waitUntil: 'networkidle0', timeout: 12000 });
    const content = await page.content();
    if (!content.includes('Fulbright') && !content.includes('scholarship') && !content.includes('Scholarship')) {
      throw new Error('No scholarship content rendered');
    }
  });
  await page.screenshot({ path: '/tmp/02_scholarships.png', fullPage: false });

  // Register page
  await check('Register form renders', async () => {
    await page.goto('http://localhost:5174/register', { waitUntil: 'networkidle0', timeout: 12000 });
    await page.waitForSelector('input', { timeout: 5000 });
  });
  await page.screenshot({ path: '/tmp/03_register.png', fullPage: false });

  // Login page
  await check('Login form renders', async () => {
    await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle0', timeout: 12000 });
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
    await page.waitForSelector('input[type="password"]', { timeout: 5000 });
  });

  // Fill and submit login form
  await check('Login form submits', async () => {
    await page.type('input[type="email"]', 'alice@example.com');
    await page.type('input[type="password"]', 'Secure1@Pass');
    await Promise.all([
      page.waitForNavigation({ timeout: 8000 }).catch(() => {}),
      page.click('button[type="submit"]'),
    ]);
    await page.waitForTimeout(2000);
  });
  await page.screenshot({ path: '/tmp/04_after_login.png', fullPage: false });

  // Check logged-in state
  await check('User is logged in (not on /login)', async () => {
    const url = page.url();
    const content = await page.content();
    if (url.includes('/login') && !content.includes('dashboard')) {
      throw new Error('Still on login page: ' + url);
    }
  });

  // Blog page
  await check('Blog page loads', async () => {
    await page.goto('http://localhost:5174/blog', { waitUntil: 'networkidle0', timeout: 12000 });
  });
  await page.screenshot({ path: '/tmp/05_blog.png', fullPage: false });

  // Contact page
  await check('Contact page loads', async () => {
    await page.goto('http://localhost:5174/contact', { waitUntil: 'networkidle0', timeout: 10000 });
  });

  // Chat page (protected)
  await check('Chat page accessible after login', async () => {
    await page.goto('http://localhost:5174/chat', { waitUntil: 'networkidle0', timeout: 12000 });
    const url = page.url();
    if (url.includes('/login')) throw new Error('Redirected to login — not authenticated');
  });
  await page.screenshot({ path: '/tmp/06_chat.png', fullPage: false });

  // Admin dashboard
  await check('Admin dashboard accessible', async () => {
    await page.goto('http://localhost:5174/admin', { waitUntil: 'networkidle0', timeout: 12000 });
    const url = page.url();
    if (url.includes('/login')) throw new Error('Redirected to login — admin auth lost');
  });
  await page.screenshot({ path: '/tmp/07_admin.png', fullPage: false });

  // User dashboard
  await check('User dashboard loads', async () => {
    await page.goto('http://localhost:5174/user-dashboard', { waitUntil: 'networkidle0', timeout: 12000 });
  });
  await page.screenshot({ path: '/tmp/08_user_dashboard.png', fullPage: false });

  await browser.close();

  console.log('\n=== Browser E2E Results ===');
  results.forEach(r => console.log(r));
  const pass = results.filter(r => r.startsWith('✅')).length;
  const fail = results.filter(r => r.startsWith('❌')).length;
  console.log(`\n${pass} passed, ${fail} failed`);
  console.log('\nScreenshots saved to /tmp/0*.png');
})();
