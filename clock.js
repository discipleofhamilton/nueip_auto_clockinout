// clock.js
const { chromium } = require('playwright');

async function runClock({ action, company, account, password, gps, headless }) {
  const ACTION_TEXT = action === 'clockin' ? '上班' : '下班';

  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({
    geolocation: gps,
    permissions: ['geolocation'],
    locale: 'zh-TW',
  });

  const page = await context.newPage();
  await page.goto('https://portal.nueip.com/home', { waitUntil: 'networkidle' });

  try {
    const companyInput = await page.$('input[name="inputCompany"]');
    if (companyInput) {
      await page.fill('input[name="inputCompany"]', company);
      await page.fill('input[name="inputID"]', account);
      await page.fill('input[name="inputPassword"]', password);
      await page.getByRole('button', { name: '登入', exact: true }).click();
      console.log("✅ 登入成功");
    } else {
      console.log("🔐 已經登入");
    }

    await page.waitForSelector(`button.el-button:has-text("${ACTION_TEXT}")`, { timeout: 5000 });
    console.log(`🔍 找到「${ACTION_TEXT}」按鈕`);

    await page.waitForTimeout(3000);
    const clockBtn = page.locator(`button.el-button:has-text("${ACTION_TEXT}")`).first();

    if (clockBtn && await clockBtn.isVisible()) {
      await clockBtn.click();
      await page.waitForTimeout(1000);
      console.log(`✅ ${ACTION_TEXT}打卡成功！`);
    } else {
      console.log(`⚠️ 無法打卡（${ACTION_TEXT}按鈕不可見）`);
    }
  } catch (err) {
    console.error('⚠️ 發生錯誤：', err);
  }

  await browser.close();
}

module.exports = runClock;
