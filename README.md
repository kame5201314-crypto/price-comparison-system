# 智能商品比價系統 (Smart Price Comparison System)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6.svg)

一個功能強大的商品比價平台，支持通過**關鍵字**、**網址**或**圖片**搜尋，自動比較多個電商平台的價格。

## ✨ 核心功能

- 🔍 **多方式智能搜尋** - 關鍵字、網址、圖片三種搜尋方式
- 💰 **智能比價引擎** - 支持價格、銷量、評分、折扣多維度排序
- 🏪 **廠商管理系統** - 記錄優質廠商資訊與聯絡方式
- 📦 **訂單追蹤系統** - 訂單建立與物流追蹤

## 🎯 支持的電商平台

- ✅ 蝦皮購物 (Shopee)
- ✅ PChome 24h購物
- ✅ momo購物網

## 🚀 快速開始

### 前置需求

- Node.js 18+
- Supabase 帳號
- OpenRouter 或 OpenAI API Key（圖片搜尋功能）

### 安裝步驟

```bash
# 1. Clone 專案
git clone https://github.com/yourusername/smart-price-comparison.git
cd smart-price-comparison

# 2. 安裝依賴
npm install

# 3. 設置環境變數
cp .env.example .env
# 編輯 .env 填入您的配置

# 4. 設置數據庫
# 在 Supabase Dashboard 執行 supabase-schema.sql

# 5. 啟動開發伺服器
npm run dev
```

訪問 http://localhost:5173

## 📚 文檔

- [完整系統規劃](./PRICE_COMPARISON_SYSTEM_PLAN.md)
- [詳細使用說明](./PRICE_COMPARISON_README.md)
- [快速啟動指南](./QUICK_START_COMPARISON.md)
- [使用教學](./HOW_TO_USE.md)
- [實作完成報告](./IMPLEMENTATION_COMPLETE.md)

## 🎨 技術棧

- **前端**: React 19, TypeScript, Tailwind CSS
- **數據庫**: Supabase (PostgreSQL)
- **爬蟲**: Axios, Cheerio, Puppeteer
- **AI**: OpenRouter / OpenAI GPT-4 Vision

## 📖 使用方法

### 關鍵字搜尋
1. 輸入商品名稱（例如：iPhone 15 Pro）
2. 選擇要搜尋的平台
3. 點擊「開始比價」
4. 查看結果並排序

### 網址搜尋
1. 貼上商品連結
2. 系統自動提取資訊
3. 在其他平台搜尋相似商品

### 圖片搜尋
1. 上傳商品圖片
2. AI 自動識別商品
3. 根據識別結果搜尋各平台

## 🔧 環境變數配置

```env
# Supabase Configuration (必需)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# AI Services (圖片搜尋功能需要)
VITE_OPENROUTER_API_KEY=your_openrouter_key
```

## 📄 授權

MIT License

## 🙏 致謝

- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenRouter](https://openrouter.ai/)

---

**Built with ❤️ using React + TypeScript**
