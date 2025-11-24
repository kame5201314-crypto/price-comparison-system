# 🚀 智能商品比價系統 - 完整設置指南

本指南將幫助您在 5-10 分鐘內完成所有配置。

---

## 📋 設置檢查清單

- [ ] 步驟 1: 設置 Supabase 數據庫
- [ ] 步驟 2: 獲取 Supabase API 金鑰
- [ ] 步驟 3: 在 Vercel 添加環境變數
- [ ] 步驟 4: 重新部署網站
- [ ] 步驟 5: 驗證設置成功

---

## 步驟 1: 設置 Supabase 數據庫

### 1.1 登入 Supabase

1. 前往：https://supabase.com/dashboard
2. 使用您的帳號登入（GitHub/Google/Email）

### 1.2 選擇或創建專案

**如果您已有專案：**
- 在 Dashboard 中點擊您的專案
- 跳到步驟 1.3

**如果需要創建新專案：**
1. 點擊右上角的 **"New Project"**
2. 填寫以下資訊：
   - **Name**: `price-comparison`（或任何您喜歡的名稱）
   - **Database Password**: 設置一個強密碼（**請務必記住**）
   - **Region**: 選擇 **"Southeast Asia (Singapore)"** 或 **"Northeast Asia (Tokyo)"**
   - **Pricing Plan**: 選擇 **"Free"** 即可
3. 點擊 **"Create new project"**
4. 等待 2-3 分鐘，專案創建完成

### 1.3 執行數據庫架構 SQL

1. 在 Supabase Dashboard 左側菜單中，點擊 **"SQL Editor"** 圖標（通常是 `</>` 或資料庫圖標）

2. 點擊 **"New query"** 或 **"+ New query"** 按鈕

3. **打開本地文件**：
   - 在您的電腦上打開 `supabase-schema.sql` 文件
   - 位置：`c:\Users\user\Desktop\ecommerce-marketing-ai\supabase-schema.sql`

4. **複製並執行 SQL**：
   - 選擇 `supabase-schema.sql` 文件中的**所有內容**（Ctrl+A）
   - 複製（Ctrl+C）
   - 返回 Supabase SQL Editor
   - 將內容貼到編輯器中（Ctrl+V）
   - 點擊右下角的 **"Run"** 按鈕（或按 Ctrl+Enter）

5. **確認執行成功**：
   - 如果成功，您會看到綠色的 "Success" 訊息
   - 如果出現錯誤，請檢查是否完整複製了所有內容

6. **驗證表格創建**：
   - 點擊左側菜單的 **"Table Editor"**
   - 您應該看到以下 9 個表格：
     - ✅ products
     - ✅ vendors
     - ✅ price_records
     - ✅ orders
     - ✅ order_items
     - ✅ comparison_tasks
     - ✅ task_products
     - ✅ price_alerts
     - ✅ vendor_ratings

---

## 步驟 2: 獲取 Supabase API 金鑰

### 2.1 進入 API 設置頁面

**方法 1：通過左側菜單**
1. 點擊左側底部的 **⚙️ Settings** 圖標
2. 在 **PROJECT SETTINGS** 區塊下，點擊 **"API"**

**方法 2：直接訪問**
1. 在瀏覽器地址欄中，您的網址應該類似：
   ```
   https://supabase.com/dashboard/project/xxxxx/...
   ```
2. 將網址改為：
   ```
   https://supabase.com/dashboard/project/您的專案ID/settings/api
   ```
   - 將 `您的專案ID` 替換為您實際的專案 ID（在您截圖中是 `yaljsbdjfokfcnpjxvwq`）

### 2.2 複製 API 金鑰

在 API 設置頁面，您會看到兩個重要的值：

#### ① Project URL（專案網址）
```
https://yaljsbdjfokfcnpjxvwq.supabase.co
```
- 找到 **"Project URL"** 或 **"URL"** 區塊
- 點擊右側的 **複製按鈕** 📋
- 暫時保存到記事本

#### ② anon public key（匿名公開金鑰）
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...
```
- 找到 **"Project API keys"** 區塊
- 找到標示為 **"anon"** 或 **"anon public"** 的金鑰
- 點擊右側的 **複製按鈕** 📋
- 暫時保存到記事本

⚠️ **重要提醒**：
- ✅ 複製 **anon public** 金鑰（用於前端）
- ❌ **不要**複製 **service_role** 金鑰（僅用於後端，不應暴露在前端）

---

## 步驟 3: 在 Vercel 添加環境變數

### 3.1 前往 Vercel 環境變數頁面

1. 登入 Vercel：https://vercel.com/
2. 在 Dashboard 中點擊您的專案 **"ecommerce-marketing-ai"**
3. 點擊頂部的 **"Settings"** 標籤
4. 在左側菜單中點擊 **"Environment Variables"**

### 3.2 編輯現有的 VITE_SUPABASE_URL

根據您的截圖，`VITE_SUPABASE_URL` 已經存在，我們需要編輯它：

1. **向下滾動**頁面，找到現有的環境變數列表
2. 找到 **"VITE_SUPABASE_URL"**
3. 點擊該變數右側的 **"⋯"** 三點選單
4. 選擇 **"Edit"** 或直接點擊變數進入編輯模式
5. 在 **Value** 欄位中，貼上您從 Supabase 複製的 **Project URL**
   ```
   https://yaljsbdjfokfcnpjxvwq.supabase.co
   ```
6. 確保 **Environments** 選擇了：
   - ☑ Production
   - ☑ Preview
   - ☑ Development
7. 點擊 **"Save"** 保存

### 3.3 添加 VITE_SUPABASE_ANON_KEY

1. 點擊頁面上方的 **"Add New"** 或 **"⊕ Add Another"** 按鈕
2. 填寫環境變數：
   - **Key（名稱）**:
     ```
     VITE_SUPABASE_ANON_KEY
     ```
   - **Value（值）**: 貼上您從 Supabase 複製的 **anon public** 金鑰
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...
     ```
   - **Environments（環境）**: 選擇全部
     - ☑ Production
     - ☑ Preview
     - ☑ Development

3. 點擊 **"Save"** 保存

### 3.4 添加 VITE_OPENROUTER_API_KEY（可選 - 圖片搜尋功能）

**如果您需要圖片搜尋功能**，請添加：

1. 點擊 **"⊕ Add Another"**
2. 填寫：
   - **Key**:
     ```
     VITE_OPENROUTER_API_KEY
     ```
   - **Value**: 您的 OpenRouter API 金鑰
   - **Environments**: 全選

3. 點擊 **"Save"**

**如何獲取 OpenRouter API Key：**
1. 前往：https://openrouter.ai/
2. 註冊或登入帳號
3. 前往 Keys 頁面：https://openrouter.ai/keys
4. 點擊 **"Create Key"** 創建新金鑰
5. 複製金鑰並添加到 Vercel

**或者使用 OpenAI API Key：**
- 如果您已有 OpenAI 帳號，可以使用 `VITE_OPENAI_API_KEY` 代替
- 從 https://platform.openai.com/api-keys 獲取

---

## 步驟 4: 重新部署網站

添加完所有環境變數後，需要重新部署：

### 4.1 觸發重新部署

1. 在 Vercel Dashboard 中，點擊頂部的 **"Deployments"** 標籤
2. 找到最新的部署（列表最上方）
3. 點擊該部署右側的 **"⋯"** 三點選單
4. 選擇 **"Redeploy"**
5. 在彈出的確認對話框中，再次點擊 **"Redeploy"**

### 4.2 等待部署完成

- 部署通常需要 **1-2 分鐘**
- 您會看到部署狀態從 **"Building"** → **"Deploying"** → **"Ready"**
- 當狀態變為 **"Ready"** 且顯示綠色勾勾 ✅，表示部署成功

---

## 步驟 5: 驗證設置成功

### 5.1 訪問您的網站

打開瀏覽器，訪問：
```
https://ecommerce-marketing-ai.vercel.app
```

### 5.2 檢查配置狀態

**如果配置成功**：
- ✅ 網站正常顯示
- ✅ **沒有**黃色的配置警告橫幅
- ✅ 可以看到搜尋介面

**如果仍然看到黃色警告**：
- ⚠️ 表示環境變數未正確配置
- 請檢查：
  1. 環境變數名稱是否正確（注意大小寫）
  2. 是否已完成重新部署
  3. 清除瀏覽器快取（Ctrl+Shift+R）並重新整理

### 5.3 測試搜尋功能

1. **測試關鍵字搜尋**：
   - 點擊 **"關鍵字搜尋"** 分頁
   - 輸入：`iPhone 15`
   - 選擇一個平台（例如：蝦皮）
   - 點擊 **"開始比價"**
   - 等待 5-10 秒查看結果

2. **檢查控制台**：
   - 按 F12 打開開發者工具
   - 切換到 **Console** 標籤
   - 應該**沒有**紅色錯誤訊息
   - 如果有警告訊息 ⚠️ 但功能正常，則可以忽略

---

## ✅ 設置完成！

恭喜您完成所有設置！現在您可以：

- ✅ 使用關鍵字搜尋商品
- ✅ 使用網址搜尋商品
- ✅ 使用圖片搜尋商品（如已配置 AI API）
- ✅ 比較多個平台的價格
- ✅ 查看商品詳細資訊

---

## 🔧 常見問題排查

### Q1: 網站顯示黃色警告橫幅

**問題**：配置提醒仍然顯示

**原因**：
- 環境變數未正確添加
- 部署未完成
- 瀏覽器快取

**解決方法**：
1. 檢查 Vercel Environment Variables 頁面，確認變數存在
2. 檢查變數名稱：
   - ✅ `VITE_SUPABASE_URL`（注意 `VITE_` 前綴）
   - ✅ `VITE_SUPABASE_ANON_KEY`
   - ❌ 不要有多餘的空格
3. 確認已重新部署（Deployments 頁面應顯示 "Ready"）
4. 清除瀏覽器快取：
   - Chrome: Ctrl+Shift+Delete → 選擇 "快取的圖片和文件" → 清除
   - 或直接按 Ctrl+Shift+R 強制刷新

### Q2: 搜尋沒有結果

**問題**：點擊搜尋後沒有返回結果

**可能原因**：
1. **網路問題**：爬蟲無法訪問目標網站
2. **平台限制**：某些平台可能限制爬蟲
3. **關鍵字問題**：搜尋關鍵字過於籠統或特殊

**解決方法**：
1. 嘗試不同的關鍵字（例如：具體的品牌和型號）
2. 嘗試其他平台
3. 檢查瀏覽器控制台是否有錯誤訊息
4. 等待幾秒後重試

### Q3: 圖片搜尋不可用

**問題**：上傳圖片後無法搜尋

**原因**：
- 未配置 `VITE_OPENROUTER_API_KEY` 或 `VITE_OPENAI_API_KEY`

**解決方法**：
1. 獲取 OpenRouter 或 OpenAI API 金鑰
2. 在 Vercel 添加對應的環境變數
3. 重新部署
4. 圖片搜尋功能是**可選的**，不影響關鍵字和網址搜尋

### Q4: SQL 執行失敗

**問題**：執行 supabase-schema.sql 時出現錯誤

**常見錯誤和解決方法**：

**錯誤 1**: "extension uuid-ossp does not exist"
- **原因**：數據庫未啟用 UUID 擴展
- **解決**：在 SQL Editor 先執行：
  ```sql
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  ```

**錯誤 2**: "table already exists"
- **原因**：表格已存在
- **解決**：如果要重新創建，先刪除現有表格：
  ```sql
  DROP TABLE IF EXISTS vendor_ratings CASCADE;
  DROP TABLE IF EXISTS price_alerts CASCADE;
  DROP TABLE IF EXISTS task_products CASCADE;
  DROP TABLE IF EXISTS comparison_tasks CASCADE;
  DROP TABLE IF EXISTS order_items CASCADE;
  DROP TABLE IF EXISTS orders CASCADE;
  DROP TABLE IF EXISTS price_records CASCADE;
  DROP TABLE IF EXISTS vendors CASCADE;
  DROP TABLE IF EXISTS products CASCADE;
  ```
  然後重新執行完整的 schema

**錯誤 3**: "permission denied"
- **原因**：權限不足
- **解決**：確保您使用的是專案擁有者帳號

### Q5: 無法登入 Supabase 或 Vercel

**問題**：忘記密碼或無法登入

**解決方法**：
- **Supabase**: 使用 "Forgot password" 重設密碼
- **Vercel**: 使用 GitHub/Google 帳號登入通常更簡單

---

## 📚 相關文檔

- [完整系統規劃](./PRICE_COMPARISON_SYSTEM_PLAN.md)
- [詳細使用說明](./HOW_TO_USE.md)
- [快速啟動指南](./QUICK_START_COMPARISON.md)
- [實作完成報告](./IMPLEMENTATION_COMPLETE.md)

---

## 💬 需要幫助？

如果您遇到任何問題，請提供以下資訊：

1. **錯誤訊息**（瀏覽器控制台的完整錯誤）
2. **步驟**（您在哪一步遇到問題）
3. **截圖**（如有必要）

---

**祝您使用愉快！🎉**

最後更新：2025-11-20
