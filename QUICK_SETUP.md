# 快速設定指南（3 分鐘）

## ✅ 您已經在 OpenRouter！

根據您的截圖，您已經在正確的平台了！

---

## 🚀 快速 3 步驟

### 步驟 1：建立 API Key

在您目前的 OpenRouter 頁面：

1. **Name 欄位**：輸入 `E-commerce Marketing AI`
2. **Project 欄位**：保持 `Default project`
3. **Permissions**：選擇 `All`（預設就是）
4. 點擊 **Create secret key** 按鈕
5. **重要！複製顯示的 API Key**（只會顯示一次）

API Key 格式：`sk-or-v1-xxxxxxxxxxxxx`

---

### 步驟 2：設定專案

在您的電腦上：

1. 開啟檔案總管
2. 前往：`C:\Users\user\Desktop\ecommerce-marketing-ai`
3. 建立新檔案：`.env`（注意前面有個點）
4. 用記事本開啟，貼上：

```env
VITE_OPENROUTER_API_KEY=sk-or-v1-你剛複製的金鑰
```

5. 儲存檔案

---

### 步驟 3：重啟伺服器

回到命令列：

1. 按 `Ctrl + C` 停止伺服器
2. 重新啟動：

```bash
npm run dev
```

---

## ✅ 驗證成功

打開瀏覽器，按 `F12` 開啟 Console，應該看到：

```
🤖 使用 OpenRouter 分析網址: ...
```

如果看到這個，就表示成功了！🎉

---

## 💰 費用說明

OpenRouter 預設使用 **Gemini Flash（免費）**

- ✅ 完全免費
- ✅ 速度很快
- ✅ 品質不錯

**不需要儲值，直接就能用！**

---

## 🎯 進階設定（可選）

### 切換到其他模型

如果您想使用其他模型，編輯 `.env` 加入：

```env
# 免費模型（預設）
VITE_AI_MODEL=google/gemini-flash-1.5

# 或使用超便宜的 Claude（推薦）
VITE_AI_MODEL=anthropic/claude-3-haiku

# 或使用 GPT-3.5
VITE_AI_MODEL=openai/gpt-3.5-turbo

# 或使用 GPT-4（品質最好但較貴）
VITE_AI_MODEL=openai/gpt-4-turbo
```

### 模型比較

| 模型 | 費用 | 品質 | 速度 |
|------|------|------|------|
| Gemini Flash | 免費 | ⭐⭐⭐⭐ | ⚡⚡⚡ |
| Claude 3 Haiku | $0.00025/1K | ⭐⭐⭐⭐ | ⚡⚡⚡ |
| GPT-3.5 Turbo | $0.002/1K | ⭐⭐⭐⭐ | ⚡⚡ |
| GPT-4 Turbo | $0.01/1K | ⭐⭐⭐⭐⭐ | ⚡ |

---

## ❓ 遇到問題？

### 問題 1：找不到 .env 檔案

解決：
1. 確認檔名是 `.env`（不是 `.env.txt`）
2. Windows 可能隱藏副檔名，請顯示副檔名

### 問題 2：還是顯示模擬資料

解決：
1. 確認 `.env` 在正確位置
2. 確認 API Key 正確
3. 確實重啟了伺服器（Ctrl+C 然後 npm run dev）

### 問題 3：API 錯誤

解決：
1. 檢查 API Key 是否正確
2. 確認 API Key 有權限（選擇 All）
3. 查看 Console 的錯誤訊息

---

## 📚 完整文件

更詳細的說明請參考：

- **[OPENROUTER_SETUP.md](./OPENROUTER_SETUP.md)** - 完整 OpenRouter 指南
- **[AI_SETUP_GUIDE.md](./AI_SETUP_GUIDE.md)** - OpenAI 設定指南（備用）

---

## 🎉 開始使用

設定完成後，您就可以：

1. **貼上商品網址** - AI 自動分析商品資訊
2. **生成文案** - 5 種風格任您選
3. **分析受眾** - 智能推薦目標客群

完全免費！馬上試試看吧！🚀
