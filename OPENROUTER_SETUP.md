# OpenRouter 設定指南（推薦）

## 🎯 為什麼選擇 OpenRouter？

OpenRouter 是一個 AI 模型聚合平台，讓您可以用一個 API Key 使用多種 AI 模型！

### ✅ 優點

1. **價格便宜** - 比直接使用 OpenAI 便宜很多
2. **有免費額度** - Gemini Flash、Llama 等模型免費
3. **多種模型** - GPT-4、Claude、Gemini、Llama 都支援
4. **一個 API Key** - 不用為每個服務申請
5. **按使用量計費** - 用多少付多少

---

## 📝 快速設定（3 分鐘）

### 步驟 1：註冊 OpenRouter

1. 前往 **https://openrouter.ai/**
2. 點擊右上角 **Sign In**
3. 選擇使用 Google 或 GitHub 帳號登入

### 步驟 2：取得 API Key

1. 登入後，點擊右上角頭像
2. 選擇 **Keys**
3. 點擊 **Create new secret key**
4. 輸入名稱（例如：E-commerce Marketing AI）
5. 複製 API Key（格式：`sk-or-v1-...`）

### 步驟 3：儲值（可選）

如果您要使用付費模型：
1. 點擊右上角頭像 → **Credits**
2. 選擇儲值金額（最低 $5 USD）
3. 使用信用卡付款

**注意：**
- 免費模型不需要儲值
- 建議先用免費模型測試

### 步驟 4：設定專案

在專案根目錄建立 `.env` 檔案：

```env
# 貼上您的 OpenRouter API Key
VITE_OPENROUTER_API_KEY=sk-or-v1-你的金鑰

# 選擇模型（可選，預設使用免費的 Gemini Flash）
VITE_AI_MODEL=google/gemini-flash-1.5
```

### 步驟 5：重啟開發伺服器

```bash
# 停止目前的伺服器（Ctrl+C）
# 重新啟動
npm run dev
```

### 步驟 6：驗證

打開瀏覽器 Console（F12），應該看到：

```
🤖 使用 OpenRouter 分析網址: ...
💰 Token 使用: 245 (輸入: 123, 輸出: 122)
✅ AI 分析完成
```

---

## 💰 可用模型與價格

### 免費模型（推薦新手）

| 模型 | 說明 | 費用 | 速度 | 品質 |
|------|------|------|------|------|
| **Gemini Flash 1.5** | Google 最新快速模型 | 免費 | ⚡⚡⚡ | ⭐⭐⭐⭐ |
| **Llama 3.1 8B** | Meta 開源模型 | 免費 | ⚡⚡ | ⭐⭐⭐ |

### 低價模型（推薦使用）

| 模型 | 說明 | 費用 | 速度 | 品質 |
|------|------|------|------|------|
| **Claude 3 Haiku** | Anthropic 快速模型 | $0.00025/1K | ⚡⚡⚡ | ⭐⭐⭐⭐ |
| **Gemini Pro 1.5** | Google 專業模型 | $0.00125/1K | ⚡⚡ | ⭐⭐⭐⭐⭐ |
| **GPT-3.5 Turbo** | OpenAI 經典模型 | $0.002/1K | ⚡⚡ | ⭐⭐⭐⭐ |

### 高品質模型

| 模型 | 說明 | 費用 | 速度 | 品質 |
|------|------|------|------|------|
| **Claude 3.5 Sonnet** | 最佳寫作品質 | $0.003/1K | ⚡ | ⭐⭐⭐⭐⭐ |
| **GPT-4 Turbo** | OpenAI 旗艦模型 | $0.01/1K | ⚡ | ⭐⭐⭐⭐⭐ |

---

## 🔧 切換模型

### 方法一：設定環境變數（推薦）

編輯 `.env` 檔案：

```env
# 免費模型
VITE_AI_MODEL=google/gemini-flash-1.5

# 或使用其他模型
# VITE_AI_MODEL=anthropic/claude-3-haiku
# VITE_AI_MODEL=openai/gpt-3.5-turbo
# VITE_AI_MODEL=openai/gpt-4-turbo
```

### 方法二：在程式中修改

編輯 `src/services/openrouterService.ts`：

```typescript
// 找到這行
const DEFAULT_MODEL = import.meta.env.VITE_AI_MODEL || AVAILABLE_MODELS.FREE.id;

// 改成您想要的模型
const DEFAULT_MODEL = 'anthropic/claude-3-haiku';
```

---

## 💡 使用建議

### 新手建議

**使用免費的 Gemini Flash：**
```env
VITE_AI_MODEL=google/gemini-flash-1.5
```

**優點：**
- ✅ 完全免費
- ✅ 速度很快
- ✅ 品質不錯
- ✅ 適合測試

### 正式使用建議

**使用 Claude 3 Haiku（最推薦）：**
```env
VITE_AI_MODEL=anthropic/claude-3-haiku
```

**優點：**
- ✅ 超便宜（$0.00025/1K）
- ✅ 速度快
- ✅ 品質優秀
- ✅ 適合大量使用

**每天生成 100 次文案的成本：**
- 輸入：100 次 × 500 tokens = 50K tokens
- 輸出：100 次 × 300 tokens = 30K tokens
- 費用：(50K + 30K) × $0.00025 = **$0.02（約 NT$0.6）**

### 追求最高品質

**使用 Claude 3.5 Sonnet：**
```env
VITE_AI_MODEL=anthropic/claude-3.5-sonnet
```

**優點：**
- ✅ 寫作品質最佳
- ✅ 理解力強
- ✅ 創意度高
- ⚠️ 費用較高（但仍比 GPT-4 便宜）

---

## 📊 實際成本計算

### 使用 Gemini Flash（免費）

```
✅ 完全免費
不限次數（有合理使用限制）
```

### 使用 Claude 3 Haiku（$0.00025/1K）

**單次文案生成：**
- 輸入：500 tokens
- 輸出：300 tokens
- 費用：0.8K × $0.00025 = **$0.0002（約 NT$0.006）**

**每天 100 次：**
- 費用：$0.02（約 NT$0.6）

**每月 3,000 次：**
- 費用：$0.6（約 NT$18）

### 使用 GPT-4 Turbo（$0.01/1K）

**每月 3,000 次：**
- 費用：$24（約 NT$720）

**結論：Claude 3 Haiku 便宜 40 倍！**

---

## 🔍 如何選擇模型？

### 決策樹

```
您的需求？
├─ 測試階段 / 不想花錢
│  └─ ✅ Gemini Flash（免費）
│
├─ 正式使用 / 大量生成
│  └─ ✅ Claude 3 Haiku（極便宜）
│
├─ 需要高品質文案
│  └─ ✅ Claude 3.5 Sonnet（品質最佳）
│
└─ 必須使用 GPT
   └─ GPT-3.5 Turbo（便宜）或 GPT-4（貴但好）
```

### 功能建議

| 功能 | 推薦模型 | 原因 |
|------|---------|------|
| 網址分析 | Claude 3 Haiku | 便宜、準確 |
| SEO 文案 | Claude 3.5 Sonnet | 寫作品質最好 |
| 電商文案 | Gemini Flash | 免費、夠用 |
| 受眾分析 | Claude 3 Haiku | 分析能力強 |

---

## ❓ 常見問題

### Q: OpenRouter 和 OpenAI 有什麼不同？

A: OpenRouter 是聚合平台，讓您用一個 API 使用多種模型（包括 OpenAI 的 GPT）。價格通常更便宜，而且有免費模型可選。

### Q: 需要綁定信用卡嗎？

A: 免費模型不需要。如果要使用付費模型，需要先儲值。

### Q: 有免費額度嗎？

A: 是的！Gemini Flash 和 Llama 3.1 8B 完全免費。

### Q: 如何查看使用量？

A: 登入 OpenRouter → 點擊右上角 → Activity，可以看到詳細的使用記錄和費用。

### Q: 會不會很貴？

A: 不會！使用 Claude 3 Haiku，每天生成 100 次文案只要 NT$0.6。

### Q: 可以隨時切換模型嗎？

A: 可以！只需修改 `.env` 中的 `VITE_AI_MODEL`，重啟伺服器即可。

### Q: 哪個模型最推薦？

A:
- **測試用**：Gemini Flash（免費）
- **正式用**：Claude 3 Haiku（超便宜）
- **高品質**：Claude 3.5 Sonnet（最佳寫作）

---

## 🚀 立即開始

1. 前往 https://openrouter.ai/ 註冊
2. 取得 API Key
3. 建立 `.env` 檔案
4. 重啟開發伺服器
5. 開始使用！

**建議：先用免費的 Gemini Flash 測試，滿意後再考慮付費模型。**

---

## 📞 需要幫助？

- OpenRouter 官網：https://openrouter.ai/
- 模型列表：https://openrouter.ai/models
- 價格比較：https://openrouter.ai/docs#models
- Discord 社群：https://discord.gg/openrouter

**祝您使用愉快！** 🎉
