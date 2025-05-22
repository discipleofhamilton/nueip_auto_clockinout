// webhook.js
const express = require('express');
const runClock = require('./clock');
const config = require('./config');
const { decrypt } = require('./aes');

const app = express();
app.use(express.json());

app.post('/clock', async (req, res) => {
  const { action, token, payload } = req.body;

  if (token !== config.secretToken) {
    return res.status(403).send('❌ 無效的 token');
  }

  if (!['clockin', 'clockout'].includes(action)) {
    return res.status(400).send('❌ 無效的打卡指令');
  }

  if (!payload) {
    return res.status(400).send('❌ 缺少加密 payload');
  }

  let user;
  try {
    user = decrypt(payload); // 解密 payload 取得帳密資料
  } catch (err) {
    return res.status(400).send('❌ 加密資料錯誤');
  }

  try {
    await runClock({
      action,
      company: user.company,
      account: user.account,
      password: user.password,
      gps: config.gps,
      headless: config.headless,
    });
    console.log(`${action} ${user.account}`);
    res.send(`✅ ${action} 完成`);
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ 執行錯誤');
  }
});

app.listen(3000, () => {
  console.log('🚀 Webhook server listening on http://localhost:3000/clock');
});

