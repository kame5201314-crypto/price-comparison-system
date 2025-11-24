# 🚀 智能商品比價系統 - 部署資訊

## 📦 GitHub 倉庫

**倉庫地址**: https://github.com/kame5201314-crypto/smart-price-comparison

---

## 🌐 線上網站（更新）

### 🎯 主要域名（請使用這些）

**生產環境**: https://ecommerce-marketing-ai.vercel.app

**備用域名**: 
- https://ecommerce-marketing-ai-kaweis-projects.vercel.app
- https://ecommerce-marketing-2zuwzmka1-kaweis-projects.vercel.app

### ✅ 部署狀態
- **平台**: Vercel
- **專案名稱**: ecommerce-marketing-ai
- **狀態**: ✅ 已部署並正常運行
- **最後更新**: 2025-11-20

---

## 🔧 環境變數設置

### ⚠️ 重要：需要配置以下環境變數

網站目前可以訪問，但需要配置環境變數才能使用搜尋功能。

### Vercel Dashboard 設置步驟：

1. 訪問: https://vercel.com/kaweis-projects/ecommerce-marketing-ai/settings/environment-variables

2. 點擊 "Add Another" 添加以下變數：

```env
# Supabase (必需 - 數據庫功能)
Key: VITE_SUPABASE_URL
Value: https://your-project.supabase.co
Environment: Production, Preview, Development (全選)

Key: VITE_SUPABASE_ANON_KEY
Value: your_supabase_anon_key
Environment: Production, Preview, Development (全選)

# AI Services (可選 - 圖片搜尋功能)
Key: VITE_OPENROUTER_API_KEY
Value: sk-or-your-key
Environment: Production, Preview, Development (全選)
```

3. 點擊 "Save" 保存

4. 重新部署（Vercel 會自動提示）

---

## 📝 獲取 Supabase 憑證

1. 登入 [Supabase Dashboard](https://app.supabase.com/)
2. 選擇或創建專案
3. 進入 **Settings** → **API**
4. 複製：
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

---

## 🗄️ 設置數據庫

在 Supabase SQL Editor 執行 `supabase-schema.sql`:

1. 進入 Supabase Dashboard
2. 選擇專案
3. 點擊 **SQL Editor**
4. 打開 `supabase-schema.sql` 文件
5. 複製全部內容並執行

---

## 🔗 快速連結

| 類型 | 連結 |
|------|------|
| 🌐 主要網站 | https://ecommerce-marketing-ai.vercel.app |
| 📦 GitHub | https://github.com/kame5201314-crypto/smart-price-comparison |
| ⚙️ Vercel Dashboard | https://vercel.com/kaweis-projects/ecommerce-marketing-ai |
| 🔐 環境變數設置 | https://vercel.com/kaweis-projects/ecommerce-marketing-ai/settings/environment-variables |

---

## ✅ 檢查清單

- [x] GitHub 倉庫已創建
- [x] 代碼已推送
- [x] Vercel 部署成功
- [x] 網站可訪問
- [ ] 配置 Supabase 環境變數
- [ ] 執行數據庫 Schema
- [ ] 配置 AI API（可選）
- [ ] 測試搜尋功能

---

## 📊 部署歷史

- ✅ 初始部署 (v1.0.0)
- ✅ 修復空白頁面問題
- ✅ 更新標題與 SEO
- ✅ 修復主域名訪問

---

**最後更新**: 2025-11-20  
**狀態**: ✅ 網站運行正常，等待環境配置  
**主要網址**: https://ecommerce-marketing-ai.vercel.app
