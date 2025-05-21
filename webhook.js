// webhook.js
const express = require('express');
const { exec } = require('child_process');
const app = express();
app.use(express.json());

app.post('/clock', (req, res) => {
  const { action } = req.body;
  if (action !== 'clockin' && action !== 'clockout') {
    return res.status(400).send('Invalid action');
  }

  exec(`node clock.js ${action}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ 執行錯誤: ${stderr}`);
      return res.status(500).send('Error executing script');
    }
    console.log(stdout);
    res.send(`✅ 執行完成：${action}`);
  });
});

app.listen(3000, () => {
  console.log('🚀 Webhook server on http://localhost:3000/clock');
});
