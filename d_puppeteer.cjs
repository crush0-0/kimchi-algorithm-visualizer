const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER]: ${msg.text()}`);
  });
  page.on('pageerror', err => {
    console.error(`[PAGE_ERROR]:`, err);
  });
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 10000 }).catch(e => console.error(e));
  
  await browser.close();
})();
