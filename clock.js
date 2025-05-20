// clock.js
const { chromium } = require('playwright');
const config = require('./config');

const ACTION = process.argv[2]; // 'clockin' or 'clockout'
const ACTION_TEXT = ACTION === 'clockin' ? '上班' : '下班';

(async () => {
  const browser = await chromium.launch({ headless: config.headless });
  const context = await browser.newContext({
    geolocation: {
      latitude: config.gps.lat,
      longitude: config.gps.lon,
    },
    permissions: ['geolocation'],
    locale: 'zh-TW',
  });

  const page = await context.newPage();
  await page.goto('https://portal.nueip.com/home', { waitUntil: 'networkidle' });

  try {
    const companyInput = await page.$('input[name="inputCompany"]');
    if (companyInput) {
      await page.fill('input[name="inputCompany"]', config.company);
      await page.fill('input[name="inputID"]', config.account);
      await page.fill('input[name="inputPassword"]', config.password);
      await page.getByRole('button', { name: '登入', exact: true }).click();
      await page.waitForNavigation({ waitUntil: 'networkidle' });
      console.log("✅ 登入成功");
    } else {
      console.log("🔐 已經登入");
    }

    // wait for the clock button show up
    try {
      await page.waitForSelector(`button.el-button:has-text(\"${ACTION_TEXT}\")`, {
        timeout: 5000,
      });
      console.log(`🔍 找到「${ACTION_TEXT}」按鈕`);
    } catch (e) {
      console.error(`❌ 找不到「${ACTION_TEXT}」按鈕`, e);
      await page.screenshot({ path: `debug_no_button_${ACTION}.png` });
      process.exit(1);
    }

    const clockBtn = page.locator(`button.el-button:has-text(\"${ACTION_TEXT}\")`).first();
    if (await clockBtn.isVisible()) {
      await clockBtn.click();
      console.log(`✅ ${ACTION_TEXT}打卡成功！`);
    } else {
      console.log(`⚠️ 無法打卡（${ACTION_TEXT}按鈕不可見）`);
    }
  } catch (err) {
    console.error('⚠️ 發生錯誤：', err);
  }

  await browser.close();
})();
