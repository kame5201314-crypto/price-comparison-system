# 電商行銷自動化系統 - 快速開始

## 🚀 快速啟動

### 1. 安裝依賴
```bash
npm install
```

### 2. 啟動開發伺服器
```bash
npm run dev
```

### 3. 打開瀏覽器
訪問 [http://localhost:5173](http://localhost:5173)

---

## 📋 系統說明

這個專案現在包含 **兩個系統**：

### 🎨 電商行銷自動化系統（新）
- AI 商品文案自動生成（5種類型）
- AI 批次產圖（背景替換、情境生成）
- 影音腳本 AI 生成
- 多平台格式轉換（蝦皮、Momo）
- FB 廣告素材自動生成
- 受眾分析

### 👥 KOL 管理系統（原有）
- KOL 資料管理
- 合作專案追蹤
- 銷售績效統計
- 分潤計算

---

## 🎯 快速測試電商行銷系統

### 登入系統
1. 使用任意帳號密碼登入（開發環境）
2. 系統預設進入「電商行銷系統」

### 測試文案生成
1. 點擊「AI 文案生成」
2. 輸入商品名稱：`智能藍牙自拍棒`
3. 選擇文案類型：全選
4. 點擊「開始生成文案」
5. 查看生成的 5 種文案

### 測試圖片生成
1. 點擊「AI 批次產圖」
2. 上傳商品圖片
3. 選擇風格：IG 風格
4. 選擇背景：純白背景
5. 設定數量：5 張
6. 點擊「開始生成圖片」

### 測試影片腳本
1. 點擊「影片腳本」
2. 輸入商品名稱和描述
3. 選擇風格：帶貨口播
4. 設定時長：15 秒
5. 點擊「開始生成腳本」
6. 查看分鏡表

### 測試平台轉換
1. 點擊「平台轉換」
2. 輸入商品資訊
3. 選擇平台：蝦皮 Shopee
4. 點擊「開始轉換」
5. 下載 CSV 檔案

### 測試 FB 廣告
1. 點擊「FB 廣告」
2. 輸入商品資訊
3. 設定生成數量：5 篇
4. 點擊「開始生成廣告」
5. 查看 FB 廣告預覽

### 測試受眾分析
1. 點擊「受眾分析」
2. 輸入商品名稱：`自拍棒`
3. 點擊「分析」
4. 查看建議受眾群體

---

## 💡 系統切換

在頂部導航列可以切換系統：
- **電商行銷系統** - 新的 AI 行銷工具
- **KOL 管理系統** - 原有的 KOL 管理功能

---

## 📁 專案結構

```
src/
├── App.tsx                               # 主應用（整合兩個系統）
├── components/
│   ├── marketing/                        # 電商行銷系統
│   │   ├── MarketingAutomationSystem.tsx # 主頁面
│   │   ├── CopywritingGenerator.tsx      # 文案生成
│   │   ├── ImageGenerator.tsx            # 圖片生成
│   │   ├── VideoScriptGenerator.tsx      # 影片腳本
│   │   ├── PlatformConverter.tsx         # 平台轉換
│   │   ├── FBAdGenerator.tsx             # FB 廣告
│   │   └── AudienceAnalyzer.tsx          # 受眾分析
│   └── [其他 KOL 相關元件]
├── types/
│   └── marketing.ts                      # 型別定義
└── services/
    └── aiMarketingService.ts             # AI 服務層
```

---

## 🔧 技術棧

- **前端框架**: React 18 + TypeScript
- **建置工具**: Vite
- **樣式**: Tailwind CSS
- **圖示**: Lucide React
- **路由**: React Router (用於 KOL 系統)
- **狀態管理**: React Hooks

---

## 🎨 功能亮點

### ① AI 文案生成
- ✅ 5 種文案類型（SEO、電商、感性、短標題、蝦皮規格）
- ✅ 網址自動分析
- ✅ 編輯、複製、存模板
- ✅ 匯出 CSV

### ② AI 批次產圖
- ✅ 4 種風格模板
- ✅ 6 種背景選擇
- ✅ 3-20 張批次生成
- ✅ 自動去背
- ✅ 加入 Logo
- ✅ ZIP 打包下載

### ③ 影片腳本
- ✅ 3 種影片風格
- ✅ 完整分鏡表
- ✅ 拍攝建議
- ✅ 匯出拍攝清單

### ④ 平台轉換
- ✅ 蝦皮格式（含 CSV）
- ✅ Momo 格式
- ✅ 自動字數限制
- ✅ 規格與賣點整理

### ⑤ FB 廣告
- ✅ 1-10 篇批次生成
- ✅ 格式自動驗證
- ✅ FB 廣告預覽
- ✅ 符合 FB 規格

### ⑥ 受眾分析
- ✅ 智能受眾推薦
- ✅ 人口統計分析
- ✅ 平台建議
- ✅ 關鍵字推薦

---

## 📝 注意事項

### 目前狀態
- ✅ 所有功能的 UI 已完成
- ✅ 使用模擬資料示範功能
- ⚠️ AI 服務層使用 Mock Data（需接入真實 API）

### 如何接入真實 AI API

1. **OpenAI API** (用於文案生成)
   ```typescript
   // 在 aiMarketingService.ts 中
   const response = await fetch('https://api.openai.com/v1/chat/completions', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${OPENAI_API_KEY}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       model: 'gpt-4',
       messages: [...]
     })
   });
   ```

2. **DALL-E / Midjourney** (用於圖片生成)
   - 需要接入對應的 API
   - 參考各服務的官方文件

3. **Remove.bg API** (用於去背)
   - 註冊並取得 API Key
   - 整合到 `removeBackground` 函數

### 環境變數設定

建立 `.env` 檔案：
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_REMOVE_BG_API_KEY=your_remove_bg_api_key_here
```

---

## 🐛 常見問題

**Q: 為什麼 AI 生成很快？**
A: 目前使用模擬資料，實際接入 AI API 後會需要較長時間。

**Q: 生成的內容是真的嗎？**
A: 是的，都是精心設計的範例內容，展示實際使用效果。

**Q: 如何切換到 KOL 系統？**
A: 點擊頂部的「KOL 管理系統」按鈕即可切換。

**Q: 圖片生成的圖片是哪來的？**
A: 使用 picsum.photos 的隨機圖片作為示範。

---

## 📚 詳細文件

請參閱 [MARKETING_SYSTEM_README.md](./MARKETING_SYSTEM_README.md) 獲取完整的功能說明和使用指南。

---

## 🎉 開始使用

現在你可以：
1. 啟動開發伺服器：`npm run dev`
2. 打開瀏覽器：`http://localhost:5173`
3. 登入系統
4. 開始體驗電商行銷自動化功能！

祝使用愉快！ 🚀
