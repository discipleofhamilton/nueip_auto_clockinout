# 📌 Nueip 自動打卡工具（上班 / 下班）

這是一個使用 [Playwright](https://playwright.dev/) 實作的自動化打卡腳本，能模擬登入 Nueip 人資系統並執行「上班」或「下班」打卡操作。

---

## 🛠 開發環境安裝與設定流程

### ✅ 系統需求

* Node.js v16 或以上（建議使用最新版）
* 作業系統支援 macOS / Linux / Windows
* 網路正常、可連線 [https://portal.nueip.com](https://portal.nueip.com)

---

### 📦 安裝步驟

1. **下載專案**

```bash
git clone https://github.com/discipleofhamilton/nueip_auto_clockinout.git
cd nueip_auto_clockinout
```

2. **安裝依賴套件**

```bash
npm install
npx playwright install
npm install express
```

> Playwright 安裝完成後，會自動下載 Chromium 瀏覽器供模擬使用。

---

### ⚙️ 建立設定檔 `config.js`

在專案根目錄建立 `config.js`，輸入你的打卡資訊，例如：

```js
module.exports = {
  secretToken: 'YOUR_SECRET_TOKEN',
  gps: {
    latitude: 25.033964,   // 打卡的模擬 GPS 緯度（例如台北 101）
    longitude: 121.564468  // 打卡的模擬 GPS 經度
  },
  headless: false // true 表示無頭模式，若需除錯請設為 false
};
```

✅ **小提醒**：`company` 通常是登入時出現在網址或表單中的公司識別字串。

---

## 🚀 如何執行打卡

### 上班打卡

```bash
node clock.js clockin
```

### 下班打卡

```bash
node clock.js clockout
```

### CLI 參數說明

| 參數       | 說明     |
| -------- | ------ |
| clockin  | 進行上班打卡 |
| clockout | 進行下班打卡 |

---

## 🐞 錯誤排查

若找不到按鈕或打卡失敗，會在專案根目錄產生截圖：

* `debug_no_button_clockin.png`
* `debug_no_button_clockout.png`

請打開該圖片查看畫面是否與你預期相同，協助你定位錯誤。

---

## 💡 其他建議

* 若需要排程，可透過 `crontab` 或 `Windows 工作排程器`搭配腳本執行。
* 若要部署到雲端，可考慮搭配 GitHub Actions、AWS Lambda（需額外打包 Chromium）或 Vercel Serverless Functions。
* 若需環境變數管理，建議改用 `.env` 並搭酌 `dotenv` 模組管理。

---

## 📄 相關技術

* [Playwright](https://playwright.dev/)
* Node.js + ES Modules（目前使用 CommonJS）
