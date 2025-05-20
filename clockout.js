const { chromium } = require('playwright');
const config = require('./config');

(async () => {
  const browser = await chromium.launch({ headless: config.headless });
  const context = await browser.newContext({
    geolocation: { 
        latitude: config.gps.lat, 
        longitude: config.gps.lon
    },
    permissions: ['geolocation'],
    locale: 'zh-TW',
  });

  const page = await context.newPage();
  await page.goto('https://portal.nueip.com/home', { waitUntil: 'networkidle' });

  try {
    // 如果有登入畫面，先登入
    const companyInput = await page.$('input[name="inputCompany"]');
    if (companyInput) {
      await page.fill('input[name="inputCompany"]', config.company);
      await page.fill('input[name="inputID"]', config.account);
      await page.fill('input[name="inputPassword"]', config.password);
      await page.getByRole('button', { name: '登入', exact: true }).click();
      await page.waitForNavigation({ waitUntil: 'networkidle' });
      console.log("login done")
    }
    else
    {
      console.log("already login")
    }

    // 點擊打卡按鈕
    try {
      await page.waitForSelector('button.el-button:has-text("下班")', { state: 'attached', timeout: 3000 });
      console.log("✅ 登入成功，打卡按鈕已出現");
    } catch (e) {
      console.error('❌ 登入成功，打卡按鈕沒有出現', e);
      // 截圖輔助debug
      await page.screenshot({ path: 'debug_no_button.png' });
      process.exit(1);
    }
    const clockBtn = page.locator('button.el-button:has-text("下班")');
    if (await clockBtn.isVisible()) {
      // await clockBtn.click();
      console.log('✅ 打卡成功！');
    } else {
      console.log('❌ 沒找到打卡按鈕，可能已打過卡或位置錯誤');
    }

  } catch (err) {
    console.error('⚠️ 發生錯誤：', err);
  }

  await browser.close();
})();
