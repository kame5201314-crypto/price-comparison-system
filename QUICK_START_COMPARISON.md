# 🚀 智能商品比價系統 - 快速啟動指南

## 📦 5分鐘快速上手

### 步驟 1: 安裝依賴

```bash
npm install
```

### 步驟 2: 設置環境變數

創建 `.env` 文件：

```bash
# 複製範例文件
cp .env.example .env
```

編輯 `.env`，至少需要配置：

```env
# Supabase (必需 - 用於數據庫)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# AI 服務 (圖片搜尋功能需要)
VITE_OPENROUTER_API_KEY=your-openrouter-key
# 或使用 OpenAI
# VITE_OPENAI_API_KEY=your-openai-key
```

### 步驟 3: 設置 Supabase 數據庫

1. 登入 [Supabase Dashboard](https://app.supabase.com/)
2. 創建新專案或選擇現有專案
3. 進入 **SQL Editor**
4. 複製 `supabase-schema.sql` 的內容
5. 執行 SQL 腳本

### 步驟 4: 啟動開發伺服器

```bash
npm run dev
```

訪問 http://localhost:5173 🎉

---

## 🎯 使用示例

### 1. 關鍵字搜尋商品

```
1. 選擇「關鍵字搜尋」
2. 輸入: "iPhone 15 Pro"
3. 選擇平台: 蝦皮、PChome、momo
4. 點擊「開始比價」
5. 查看結果並排序
```

### 2. 網址快速比價

```
1. 複製任一商品連結，例如:
   https://shopee.tw/product/123456/789012

2. 選擇「網址搜尋」
3. 貼上連結
4. 選擇其他要比價的平台
5. 系統自動提取資訊並比價
```

### 3. 圖片智能搜尋

```
1. 選擇「圖片搜尋」
2. 上傳商品圖片 (JPG/PNG)
3. AI 自動識別商品
4. 選擇平台進行搜尋
5. 查看比價結果
```

---

## ⚙️ 配置說明

### Supabase 設置

**獲取 Supabase 憑證:**

1. 登入 [Supabase](https://app.supabase.com/)
2. 選擇專案
3. 進入 **Settings** → **API**
4. 複製:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### AI 服務設置（圖片搜尋功能）

**方案 1: OpenRouter (推薦 - 便宜)**

1. 註冊 [OpenRouter](https://openrouter.ai/)
2. 獲取 API Key
3. 設置: `VITE_OPENROUTER_API_KEY=sk-or-xxx`
4. 可選模型: `VITE_AI_MODEL=google/gemini-flash-1.5` (免費)

**方案 2: OpenAI**

1. 註冊 [OpenAI](https://platform.openai.com/)
2. 獲取 API Key
3. 設置: `VITE_OPENAI_API_KEY=sk-xxx`

---

## 🔧 進階配置

### 自定義搜尋設置

在 `.env` 中配置：

```env
# 批量比價最大數量
VITE_MAX_BATCH_SIZE=100

# 爬蟲間隔時間 (毫秒)
VITE_SCRAPE_INTERVAL=14400000

# 應用名稱
VITE_APP_NAME=我的比價系統
```

### 添加新的爬蟲平台

1. 在 `src/services/crawlers/` 創建新文件，例如 `ruten.ts`
2. 繼承 `BaseCrawler` 類別
3. 實現必要方法:
   - `search()`
   - `getProductDetails()`
   - `buildSearchUrl()`
4. 在 `src/services/crawlers/index.ts` 註冊

示例:

```typescript
// src/services/crawlers/ruten.ts
import { BaseCrawler, ProductResult, SearchFilters } from './base';

export class RutenCrawler extends BaseCrawler {
  platformName = 'Ruten';
  baseUrl = 'https://www.ruten.com.tw';

  async search(keyword: string, filters?: SearchFilters): Promise<ProductResult[]> {
    // 實現搜尋邏輯
  }

  async getProductDetails(url: string): Promise<ProductResult | null> {
    // 實現商品詳情提取
  }

  protected buildSearchUrl(keyword: string, filters?: SearchFilters): string {
    // 構建搜尋 URL
  }
}
```

然後在 `index.ts` 註冊:

```typescript
import { RutenCrawler } from './ruten';

export const crawlers: Record<string, BaseCrawler> = {
  shopee: new ShopeeCrawler(),
  pchome: new PChomeCrawler(),
  momo: new MomoCrawler(),
  ruten: new RutenCrawler(), // 新增
};
```

---

## 🐛 常見問題排查

### 問題: 啟動時出現依賴錯誤

**解決方案:**
```bash
# 刪除 node_modules 和 lock 文件
rm -rf node_modules package-lock.json

# 重新安裝
npm install
```

### 問題: Supabase 連接失敗

**檢查清單:**
- [ ] `.env` 文件是否存在
- [ ] `VITE_SUPABASE_URL` 格式正確 (https://xxx.supabase.co)
- [ ] `VITE_SUPABASE_ANON_KEY` 正確複製
- [ ] 數據庫 Schema 已執行
- [ ] 檢查 Supabase Dashboard 是否正常

### 問題: 圖片搜尋失敗

**可能原因:**
- 未配置 AI API Key
- API 配額用盡
- 圖片格式不支持

**解決方案:**
```bash
# 檢查 API Key 是否設置
echo $VITE_OPENROUTER_API_KEY

# 或檢查 OpenAI
echo $VITE_OPENAI_API_KEY
```

### 問題: 爬蟲搜尋失敗

**可能原因:**
- 網路連接問題
- 平台反爬機制
- API 變更

**解決方案:**
- 檢查網路連接
- 稍後重試
- 查看控制台錯誤訊息
- 嘗試其他平台

---

## 📊 測試功能

### 測試關鍵字搜尋

```bash
# 在瀏覽器控制台執行
import { searchProductByKeyword } from './services/comparisonService';

const test = async () => {
  const results = await searchProductByKeyword({
    keyword: '測試商品',
    platforms: ['shopee'],
  });
  console.log('搜尋結果:', results);
};

test();
```

### 測試圖片識別

```bash
# 準備一張商品圖片
# 在搜尋介面上傳測試
# 查看控制台輸出的識別關鍵字
```

---

## 🚀 生產部署

### 構建專案

```bash
npm run build
```

### 部署到 Vercel

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel

# 生產環境部署
vercel --prod
```

### 部署到 Netlify

```bash
# 安裝 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy

# 生產環境部署
netlify deploy --prod
```

### 環境變數設置

在部署平台設置相同的環境變數:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENROUTER_API_KEY` (如使用圖片搜尋)

---

## 📚 相關資源

- [完整系統規劃](./PRICE_COMPARISON_SYSTEM_PLAN.md)
- [詳細 README](./PRICE_COMPARISON_README.md)
- [Supabase 文檔](https://supabase.com/docs)
- [React 文檔](https://react.dev/)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)

---

## 💡 實用技巧

### 1. 提高搜尋準確度

- 使用完整商品名稱
- 包含品牌、型號等關鍵字
- 避免過於籠統的詞彙

### 2. 優化搜尋速度

- 一次搜尋 2-3 個平台
- 使用關鍵字搜尋而非圖片搜尋
- 避免短時間內重複搜尋

### 3. 圖片搜尋最佳實踐

- 使用清晰的商品主圖
- 避免有文字或背景複雜的圖片
- 建議圖片大小 < 2MB

---

## 🎉 完成！

現在您已經成功設置並運行智能商品比價系統！

**下一步:**
- 探索廠商管理功能
- 嘗試訂單追蹤系統
- 自定義 UI 樣式
- 添加更多爬蟲平台

**需要幫助?**
- 查看 [詳細文檔](./PRICE_COMPARISON_README.md)
- 提交 [GitHub Issue](https://github.com/yourusername/ecommerce-marketing-ai/issues)

---

**Happy Coding! 🚀**
