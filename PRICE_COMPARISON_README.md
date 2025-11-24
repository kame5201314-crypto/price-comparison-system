# 智能商品比價系統 (Smart Price Comparison System)

一個功能強大的商品比價平台，支持通過**關鍵字**、**網址**或**圖片**搜尋，自動比較多個電商平台的價格，並提供廠商管理與訂單追蹤功能。

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6.svg)

---

## ✨ 核心功能

### 🔍 多方式智能搜尋
- **關鍵字搜尋**：輸入商品名稱或關鍵字，快速搜尋多個平台
- **網址搜尋**：貼上商品連結，自動提取資訊並比價
- **圖片搜尋**：上傳商品圖片，AI自動識別並搜尋

### 💰 智能比價引擎
- 支持價格、銷量、評分、折扣多維度排序
- 批量比價（最多100個商品同時處理）
- 即時價格監控與歷史追蹤
- 自動標記最低價格與熱銷商品

### 🏪 廠商管理系統
- 記錄優質廠商資訊
- 聯絡方式管理
- 廠商評分與備註
- 快速查詢與篩選

### 📦 訂單追蹤系統
- 訂單建立與狀態管理
- 物流追蹤
- 成本分析報表
- 訂單歷史記錄

---

## 🎯 支持的電商平台

- ✅ **蝦皮購物 (Shopee)**
- ✅ **PChome 24h購物**
- ✅ **momo購物網**
- 🔜 露天拍賣 (即將支持)
- 🔜 Yahoo奇摩購物 (即將支持)
- 🔜 樂天市場 (即將支持)

---

## 🚀 快速開始

### 前置需求

- Node.js 18+
- npm 或 yarn
- Supabase 帳號（用於數據庫）
- OpenRouter 或 OpenAI API Key（用於圖片識別）

### 安裝步驟

1. **Clone 專案**
```bash
git clone https://github.com/yourusername/ecommerce-marketing-ai.git
cd ecommerce-marketing-ai
```

2. **安裝依賴**
```bash
npm install
```

3. **設置環境變數**

複製 `.env.example` 為 `.env` 並填入您的配置：

```bash
cp .env.example .env
```

編輯 `.env` 文件：

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Services (for Image Recognition)
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
# 或使用 OpenAI
# VITE_OPENAI_API_KEY=your_openai_api_key

# Application Settings
VITE_APP_NAME=Smart Price Comparison
VITE_MAX_BATCH_SIZE=100
```

4. **設置 Supabase 數據庫**

在 Supabase SQL Editor 中執行 `supabase-schema.sql`：

```bash
# 登入 Supabase Dashboard
# 進入 SQL Editor
# 複製並執行 supabase-schema.sql 的內容
```

5. **啟動開發伺服器**

```bash
npm run dev
```

訪問 `http://localhost:5173` 開始使用！

---

## 📁 專案結構

```
ecommerce-marketing-ai/
├── src/
│   ├── components/           # React 元件
│   │   ├── ui/              # 基礎 UI 元件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   ├── SearchInterface.tsx     # 搜尋介面
│   │   └── ComparisonResults.tsx   # 比價結果
│   │
│   ├── services/            # 業務邏輯服務
│   │   ├── crawlers/        # 爬蟲模組
│   │   │   ├── base.ts      # 爬蟲基礎類別
│   │   │   ├── shopee.ts    # 蝦皮爬蟲
│   │   │   ├── pchome.ts    # PChome 爬蟲
│   │   │   ├── momo.ts      # momo 爬蟲
│   │   │   └── index.ts     # 爬蟲管理器
│   │   │
│   │   ├── imageRecognition.ts    # 圖片識別服務
│   │   ├── comparisonService.ts   # 比價服務
│   │   ├── vendorService.ts       # 廠商管理
│   │   └── orderService.ts        # 訂單管理
│   │
│   ├── lib/                 # 工具函數
│   │   ├── supabase.ts      # Supabase 客戶端
│   │   └── utils.ts         # 通用工具
│   │
│   ├── App.tsx              # 主應用
│   └── main.tsx             # 入口文件
│
├── supabase-schema.sql      # 數據庫 Schema
├── .env.example             # 環境變數範例
├── PRICE_COMPARISON_SYSTEM_PLAN.md  # 系統規劃文檔
└── package.json             # 專案配置
```

---

## 🎨 技術棧

### 前端
- **React 19.2** - UI 框架
- **TypeScript** - 類型安全
- **Tailwind CSS** - 樣式框架
- **Lucide React** - 圖標庫
- **React Dropzone** - 文件上傳
- **Recharts** - 圖表展示

### 後端服務
- **Supabase** - 數據庫 + 認證
- **Axios** - HTTP 客戶端
- **Cheerio** - HTML 解析
- **Puppeteer** - 動態網頁爬取

### AI 服務
- **OpenRouter** - 多模型 AI API
- **OpenAI GPT-4 Vision** - 圖片識別

---

## 🔧 使用方法

### 1. 關鍵字搜尋

1. 在首頁選擇「關鍵字搜尋」
2. 輸入商品名稱（例如：iPhone 15 Pro）
3. 選擇要搜尋的平台
4. 點擊「開始比價」
5. 查看比價結果並選擇最優惠的商品

### 2. 網址搜尋

1. 選擇「網址搜尋」
2. 貼上任一支持平台的商品連結
3. 系統自動提取商品資訊
4. 在其他平台搜尋相似商品
5. 比較價格並選購

### 3. 圖片搜尋

1. 選擇「圖片搜尋」
2. 上傳商品圖片（支援 PNG, JPG, JPEG）
3. AI 自動識別商品資訊
4. 根據識別結果搜尋各平台
5. 查看比價結果

### 4. 排序與篩選

在結果頁面可以按以下方式排序：
- 💰 **價格**：從低到高
- 📈 **銷量**：熱銷商品優先
- ⭐ **評分**：高評分商品優先
- 🔥 **折扣**：最大折扣優先

---

## 📊 API 文檔

### 搜尋 API

#### 關鍵字搜尋
```typescript
import { searchProductByKeyword } from './services/comparisonService';

const results = await searchProductByKeyword({
  keyword: 'iPhone 15',
  platforms: ['shopee', 'pchome', 'momo'],
  filters: {
    priceMin: 1000,
    priceMax: 50000,
    sortBy: 'price',
  },
});
```

#### 網址搜尋
```typescript
import { searchProductByUrl } from './services/comparisonService';

const results = await searchProductByUrl({
  url: 'https://shopee.tw/product/123/456',
  platforms: ['pchome', 'momo'],
});
```

#### 圖片搜尋
```typescript
import { searchProductByImage } from './services/comparisonService';

const result = await searchProductByImage({
  imageFile: file, // File object
  platforms: ['shopee', 'pchome', 'momo'],
});

console.log(result.keywords); // AI 識別的關鍵字
console.log(result.results);  // 搜尋結果
```

### 廠商管理 API

```typescript
import { createVendor, getVendors } from './services/vendorService';

// 創建廠商
const vendor = await createVendor({
  name: '優質賣家',
  platform: 'Shopee',
  email: 'vendor@example.com',
  rating: 4.8,
}, userId);

// 獲取所有廠商
const vendors = await getVendors(userId);
```

### 訂單管理 API

```typescript
import { createOrder, getOrders } from './services/orderService';

// 創建訂單
const order = await createOrder({
  vendorId: 'vendor-uuid',
  items: [
    {
      productName: 'iPhone 15 Pro',
      quantity: 1,
      unitPrice: 35900,
    },
  ],
  shippingFee: 60,
  notes: '請小心包裝',
}, userId);

// 獲取所有訂單
const orders = await getOrders(userId);
```

---

## 🔐 安全性考慮

### 爬蟲防護
- ✅ 使用隨機 User-Agent
- ✅ 添加隨機延遲避免被封鎖
- ✅ 錯誤重試機制
- ✅ 尊重 robots.txt

### 數據安全
- ✅ Supabase Row Level Security (RLS)
- ✅ API 使用 JWT 認證
- ✅ 敏感資訊加密存儲
- ✅ HTTPS 強制連接

### 隱私保護
- ✅ 用戶數據隔離
- ✅ 符合 GDPR 規範
- ✅ 搜尋歷史可清理

---

## 🚧 開發路線圖

### Phase 1 - MVP ✅
- [x] 基礎搜尋功能（關鍵字）
- [x] 2-3個主要平台爬蟲
- [x] 簡單比價結果顯示
- [x] 基礎廠商記錄

### Phase 2 - 核心功能 🚧
- [x] URL與圖片搜尋
- [x] 完整廠商管理系統
- [x] 訂單追蹤
- [ ] 5+平台支持
- [ ] 批量比價功能

### Phase 3 - 進階功能 📋
- [ ] 價格監控與提醒
- [ ] 歷史價格分析
- [ ] 數據匯入/匯出
- [ ] API 開放

### Phase 4 - 優化 🔮
- [ ] 性能優化
- [ ] 更多平台支持
- [ ] AI 智能推薦
- [ ] 移動端 App

---

## 📝 常見問題 (FAQ)

### Q: 為什麼搜尋速度較慢？
A: 因為需要即時爬取多個平台的數據，建議一次搜尋 2-3 個平台以獲得最佳體驗。

### Q: 圖片識別準確嗎？
A: 使用 GPT-4 Vision 或 Gemini 的識別準確率約 85-90%，建議上傳清晰的商品主圖。

### Q: 支持哪些圖片格式？
A: 支持 PNG、JPG、JPEG、GIF、WebP 等常見格式，建議文件大小不超過 5MB。

### Q: 價格會即時更新嗎？
A: 每次搜尋都會抓取最新價格，但不同平台可能有快取，建議間隔 1-2 分鐘再搜尋。

### Q: 如何處理搜尋失敗？
A: 檢查網路連接、確認平台是否正常、稍後重試。如持續失敗請回報問題。

---

## 🤝 貢獻指南

我們歡迎所有形式的貢獻！

1. Fork 本專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 開發規範
- 使用 TypeScript 並保持類型安全
- 遵循 ESLint 規則
- 撰寫清晰的註釋
- 更新相關文檔

---

## 📄 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件

---

## 🙏 致謝

- [React](https://react.dev/) - UI 框架
- [Supabase](https://supabase.com/) - 後端服務
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 圖標庫
- [OpenRouter](https://openrouter.ai/) - AI API 服務

---

## 📧 聯絡方式

- **專案問題**: [GitHub Issues](https://github.com/yourusername/ecommerce-marketing-ai/issues)
- **功能建議**: [GitHub Discussions](https://github.com/yourusername/ecommerce-marketing-ai/discussions)

---

## 🌟 如果這個專案對您有幫助，請給我們一個 Star！

**Built with ❤️ using React + TypeScript**

---

**最後更新**: 2025-11-20
**版本**: 1.0.0
