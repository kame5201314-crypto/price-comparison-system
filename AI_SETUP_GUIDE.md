# AI 整合設定指南

## 🤖 目前狀態

系統已整合 **OpenAI GPT-4** API，但需要您提供 API Key 才能使用真實 AI 功能。

### 目前運作模式

- ✅ **有設定 API Key** → 使用真實 OpenAI GPT-4 AI
- ⚠️ **未設定 API Key** → 使用模擬資料（Mock Data）

### 已整合 AI 的功能

1. **✅ 網址分析** - 抓取網頁內容並用 GPT-4 分析商品資訊
2. **✅ 文案生成** - 5 種文案類型都使用 GPT-4 生成
3. **✅ 受眾分析** - 使用 GPT-4 分析目標受眾

### 尚未整合 AI 的功能

- ❌ **圖片生成** - 需要整合 DALL-E 或 Midjourney
- ❌ **影片腳本** - 使用模擬資料
- ❌ **FB 廣告** - 使用模板生成

---

## 🔑 如何設定 OpenAI API Key

### 步驟 1：取得 API Key

1. 前往 [OpenAI Platform](https://platform.openai.com/)
2. 註冊或登入帳號
3. 點擊右上角 → API Keys
4. 點擊 "Create new secret key"
5. 複製 API Key（只會顯示一次！）

### 步驟 2：設定環境變數

在專案根目錄建立 `.env` 檔案：

```bash
# 在專案資料夾中建立 .env 檔案
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx
```

**重要：**
- `.env` 檔案已經在 `.gitignore` 中，不會被上傳到 GitHub
- 絕對不要將 API Key 公開或上傳到版本控制

### 步驟 3：重啟開發伺服器

```bash
# 停止目前的伺服器 (Ctrl+C)
# 重新啟動
npm run dev
```

### 步驟 4：驗證

開啟瀏覽器的開發者工具（F12），查看 Console：

**成功設定：**
```
🤖 使用 OpenAI 分析網址: https://...
✅ AI 分析完成: {...}
```

**未設定：**
```
⚠️ 未設定 API Key，使用模擬資料
```

---

## 💰 OpenAI API 費用說明

### GPT-4 定價（2024）

| 模型 | 輸入 | 輸出 |
|------|------|------|
| GPT-4 | $0.03 / 1K tokens | $0.06 / 1K tokens |
| GPT-3.5-Turbo | $0.001 / 1K tokens | $0.002 / 1K tokens |

### 使用估算

**單次文案生成：**
- 輸入：~500 tokens（商品資訊 + Prompt）
- 輸出：~300 tokens（生成的文案）
- 費用：~$0.03（約 NT$1）

**網址分析：**
- 輸入：~1000 tokens（網頁內容）
- 輸出：~200 tokens（JSON 格式）
- 費用：~$0.04（約 NT$1.2）

**受眾分析：**
- 輸入：~400 tokens
- 輸出：~500 tokens
- 費用：~$0.04（約 NT$1.2）

### 省錢建議

1. 使用 **GPT-3.5-Turbo** 代替 GPT-4（便宜 30 倍）
2. 設定 **max_tokens** 限制輸出長度
3. 啟用 **快取機制**（相同商品不重複分析）

---

## 🔧 進階設定

### 切換 AI 模型

編輯 [src/services/openaiService.ts](src/services/openaiService.ts)：

```typescript
// 預設使用 GPT-4
const model = 'gpt-4';

// 改為 GPT-3.5-Turbo（便宜很多）
const model = 'gpt-3.5-turbo';
```

### 調整 AI 參數

```typescript
// temperature: 創意程度（0-2）
// 0 = 最保守、一致性高
// 1 = 平衡
// 2 = 最有創意、變化多

// max_tokens: 最大輸出長度
// 文案建議：1000-2000
// 分析建議：500-1000
```

### 錯誤處理

系統已設定自動回退機制：
```
真實 AI → 失敗 → 自動切換到模擬資料
```

---

## 🌐 網址分析技術說明

### 目前使用方案

使用 **allorigins.win** 免費 CORS 代理服務：
```typescript
const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
```

### 限制

- 無法抓取需要登入的頁面
- 部分網站可能阻擋代理服務
- 速度較慢

### 替代方案

**方案一：自建後端**
```javascript
// 建立 Node.js 後端
// 使用 puppeteer 或 cheerio 抓取網頁
```

**方案二：使用付費服務**
- ScraperAPI
- Apify
- Bright Data

---

## 📊 監控 API 使用量

### OpenAI Dashboard

1. 前往 [OpenAI Usage](https://platform.openai.com/usage)
2. 查看每日/每月使用量
3. 設定使用上限

### 在程式中追蹤

編輯服務層，加入使用量記錄：

```typescript
export async function callOpenAI(prompt: string) {
  const response = await fetch(OPENAI_API_URL, {...});
  const data = await response.json();

  // 記錄使用量
  const tokensUsed = data.usage.total_tokens;
  console.log(`Token 使用量: ${tokensUsed}`);

  return data.choices[0].message.content;
}
```

---

## ❓ 常見問題

### Q: API Key 在哪裡設定？
A: 在專案根目錄建立 `.env` 檔案，加入 `VITE_OPENAI_API_KEY=你的金鑰`

### Q: 為什麼還是顯示模擬資料？
A: 檢查：
1. `.env` 檔案是否在正確位置
2. API Key 是否正確
3. 是否重啟了開發伺服器
4. 開啟 Console 查看錯誤訊息

### Q: API 費用會很貴嗎？
A: 每次請求約 NT$1-2，可改用 GPT-3.5-Turbo 降低費用

### Q: 可以使用其他 AI 嗎？
A: 可以！系統架構支援：
- OpenAI GPT
- Anthropic Claude
- Google Gemini
- 自建模型

### Q: 圖片生成功能呢？
A: 需要額外整合：
- DALL-E 3
- Midjourney
- Stable Diffusion

---

## 🚀 未來整合計劃

### 短期
- [ ] 加入 GPT-3.5-Turbo 選項
- [ ] 快取機制（避免重複請求）
- [ ] 使用量統計

### 中期
- [ ] 整合 DALL-E 3 圖片生成
- [ ] 整合 Claude 3（更便宜）
- [ ] 批次處理優化

### 長期
- [ ] 本地 AI 模型（完全免費）
- [ ] 多模型自動切換
- [ ] A/B Testing

---

## 📞 技術支援

如有任何問題，請：
1. 查看 Console 錯誤訊息
2. 檢查 `.env` 設定
3. 參考本文件的常見問題

**祝您使用愉快！** 🎉
