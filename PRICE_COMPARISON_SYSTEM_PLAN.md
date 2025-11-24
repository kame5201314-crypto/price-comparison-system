# 智能商品比價系統 - 完整規劃文檔

## 📋 系統概述

一個智能化的商品比價平台，支持通過**網址**、**圖片**或**產品名稱**進行多網站比價，並提供廠商管理與訂購追蹤功能。

---

## 🎯 核心功能需求

### 1. 多方式商品搜尋
- **URL輸入**: 貼上商品連結自動抓取商品資訊
- **圖片搜尋**: 上傳商品圖片進行視覺識別搜尋
- **名稱搜尋**: 輸入關鍵字搜尋多個電商平台

### 2. 智能比價引擎
- 自動爬取多個電商平台價格
- 支持價格、銷售量排序
- 批量商品同時比價（最多100個商品）
- 即時價格監控與歷史價格追蹤

### 3. 廠商管理系統
- 記錄比價結果中的優質廠商
- 廠商聯絡資訊管理
- 訂購歷史記錄
- 廠商評分與備註

### 4. 訂購追蹤系統
- 訂單建立與管理
- 物流狀態追蹤
- 成本分析與報表

---

## 🏗️ 系統架構

```
┌─────────────────────────────────────────────────────────┐
│                     前端層 (React + TypeScript)           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ 搜尋介面 │  │ 比價結果 │  │ 廠商管理 │  │ 訂單追蹤 │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                  API層 (Node.js/Express)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ 搜尋API  │  │ 爬蟲API  │  │ 廠商API  │  │ 訂單API  │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                     服務層                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ 爬蟲引擎 │  │ 圖片識別 │  │ 價格分析 │  │ 通知服務 │ │
│  │ (Puppeteer│ │ (AI視覺) │  │          │  │          │ │
│  │ /Playwright│ │          │  │          │  │          │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│              數據層 (PostgreSQL + Redis)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ 商品資料 │  │ 價格歷史 │  │ 廠商資料 │  │ 訂單資料 │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│                    Redis Cache (快取)                     │
└─────────────────────────────────────────────────────────┘
```

---

## 💾 數據庫設計

### Products (商品表)
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  image_url TEXT,
  original_url TEXT,
  specs JSONB, -- 商品規格
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES users(id)
);

CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_user ON products(user_id);
```

### Price_Records (價格記錄表)
```sql
CREATE TABLE price_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  vendor_id UUID REFERENCES vendors(id),
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2), -- 原價
  discount_rate DECIMAL(5, 2), -- 折扣率
  stock_status VARCHAR(50), -- 庫存狀態
  sales_volume INTEGER, -- 銷售量
  rating DECIMAL(3, 2), -- 評分
  product_url TEXT,
  scraped_at TIMESTAMP DEFAULT NOW(),
  is_available BOOLEAN DEFAULT true
);

CREATE INDEX idx_price_product ON price_records(product_id);
CREATE INDEX idx_price_vendor ON price_records(vendor_id);
CREATE INDEX idx_price_date ON price_records(scraped_at);
```

### Vendors (廠商表)
```sql
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  platform VARCHAR(100), -- 平台名稱 (蝦皮、露天等)
  contact_person VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  website TEXT,
  rating DECIMAL(3, 2), -- 廠商評分
  notes TEXT,
  tags TEXT[], -- 標籤
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES users(id)
);

CREATE INDEX idx_vendors_platform ON vendors(platform);
CREATE INDEX idx_vendors_user ON vendors(user_id);
```

### Orders (訂單表)
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(100) UNIQUE NOT NULL,
  vendor_id UUID REFERENCES vendors(id),
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_fee DECIMAL(10, 2),
  notes TEXT,
  order_date TIMESTAMP DEFAULT NOW(),
  expected_delivery DATE,
  actual_delivery DATE,
  tracking_number VARCHAR(200),
  user_id UUID REFERENCES users(id)
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_vendor ON orders(vendor_id);
CREATE INDEX idx_orders_user ON orders(user_id);
```

### Order_Items (訂單明細表)
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  specs JSONB -- 商品規格（顏色、尺寸等）
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
```

### Comparison_Tasks (比價任務表)
```sql
CREATE TABLE comparison_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_name VARCHAR(200),
  search_type VARCHAR(50), -- url, image, keyword
  search_input TEXT,
  platforms TEXT[], -- 目標平台
  status VARCHAR(50) DEFAULT 'pending', -- pending, running, completed, failed
  total_products INTEGER,
  completed_products INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  user_id UUID REFERENCES users(id)
);

CREATE INDEX idx_tasks_status ON comparison_tasks(status);
CREATE INDEX idx_tasks_user ON comparison_tasks(user_id);
```

---

## 🔧 技術架構

### 前端技術棧
- **框架**: React 18 + TypeScript
- **狀態管理**: Zustand / React Query
- **UI框架**: Tailwind CSS + shadcn/ui
- **圖表**: Recharts (價格走勢圖)
- **圖片上傳**: react-dropzone
- **表格**: TanStack Table (批量商品顯示)

### 後端技術棧
- **運行環境**: Node.js 18+
- **框架**: Express.js / Fastify
- **數據庫**: PostgreSQL 15+ (Supabase)
- **快取**: Redis (價格快取)
- **爬蟲引擎**:
  - Puppeteer (動態網頁)
  - Playwright (複雜反爬網站)
  - Cheerio (靜態網頁)
- **圖片識別**:
  - Google Vision API
  - OpenAI GPT-4 Vision
  - 百度圖片識別API

### DevOps
- **部署**: Vercel (前端) + Railway/Render (後端)
- **任務隊列**: Bull (爬蟲任務隊列)
- **監控**: Sentry (錯誤追蹤)
- **日誌**: Winston

---

## 🚀 核心功能實作

### 1. 智能搜尋模組

#### URL搜尋
```typescript
interface URLSearchInput {
  url: string;
  platforms?: string[]; // 要比價的平台
}

async function searchByURL(input: URLSearchInput) {
  // 1. 解析URL，提取商品資訊
  const productInfo = await extractProductInfo(input.url);

  // 2. 使用商品名稱在其他平台搜尋
  const keywords = generateSearchKeywords(productInfo);

  // 3. 批量爬取各平台
  const results = await crawlMultiplePlatforms(keywords, input.platforms);

  // 4. 比對商品相似度
  const matched = await matchProducts(productInfo, results);

  return matched;
}
```

#### 圖片搜尋
```typescript
interface ImageSearchInput {
  imageFile: File | string; // 圖片檔案或URL
  platforms?: string[];
}

async function searchByImage(input: ImageSearchInput) {
  // 1. 上傳圖片到儲存服務
  const imageUrl = await uploadImage(input.imageFile);

  // 2. 使用AI識別商品資訊
  const aiResult = await identifyProduct(imageUrl);
  // 返回: { category, keywords, attributes }

  // 3. 使用識別結果搜尋各平台
  const searchResults = await crawlMultiplePlatforms(
    aiResult.keywords,
    input.platforms
  );

  // 4. 使用圖片相似度比對
  const matched = await visualMatch(imageUrl, searchResults);

  return matched;
}
```

#### 關鍵字搜尋
```typescript
interface KeywordSearchInput {
  keyword: string;
  platforms: string[];
  filters?: {
    priceMin?: number;
    priceMax?: number;
    minSales?: number;
    minRating?: number;
  };
}

async function searchByKeyword(input: KeywordSearchInput) {
  // 1. 關鍵字優化
  const optimizedKeywords = await optimizeKeywords(input.keyword);

  // 2. 並行爬取所有平台
  const crawlers = input.platforms.map(platform =>
    crawlPlatform(platform, optimizedKeywords, input.filters)
  );

  const results = await Promise.allSettled(crawlers);

  // 3. 合併與去重
  const merged = mergeAndDeduplicate(results);

  return merged;
}
```

### 2. 爬蟲引擎模組

支持的電商平台：
- 蝦皮購物 (Shopee)
- 露天拍賣 (Ruten)
- PChome 24h購物
- momo購物網
- 淘寶/1688 (需代理)
- Yahoo奇摩購物
- 樂天市場

```typescript
// 爬蟲基礎類別
abstract class PlatformCrawler {
  abstract platformName: string;

  async search(keyword: string, filters?: any): Promise<Product[]> {
    // 1. 構建搜尋URL
    const searchUrl = this.buildSearchUrl(keyword, filters);

    // 2. 發送請求
    const page = await this.browser.newPage();
    await page.goto(searchUrl);

    // 3. 等待商品加載
    await this.waitForProducts(page);

    // 4. 提取商品資訊
    const products = await this.extractProducts(page);

    // 5. 清理
    await page.close();

    return products;
  }

  abstract buildSearchUrl(keyword: string, filters?: any): string;
  abstract waitForProducts(page: Page): Promise<void>;
  abstract extractProducts(page: Page): Promise<Product[]>;
}

// 蝦皮爬蟲實作
class ShopeeCrawler extends PlatformCrawler {
  platformName = 'Shopee';

  buildSearchUrl(keyword: string, filters?: any): string {
    const params = new URLSearchParams({
      keyword: keyword,
      sortBy: filters?.sortBy || 'relevancy',
      // ... 其他參數
    });
    return `https://shopee.tw/search?${params}`;
  }

  async extractProducts(page: Page): Promise<Product[]> {
    return await page.$$eval('.shopee-search-item-result__item', items => {
      return items.map(item => ({
        name: item.querySelector('.shopee-item-card__text-name')?.textContent,
        price: parsePrice(item.querySelector('.shopee-price')?.textContent),
        sales: parseSales(item.querySelector('.shopee-sales')?.textContent),
        // ... 其他欄位
      }));
    });
  }
}
```

### 3. 批量比價模組

```typescript
interface BatchComparisonInput {
  products: Array<{
    identifier: string; // URL、圖片URL或關鍵字
    type: 'url' | 'image' | 'keyword';
  }>;
  platforms: string[];
  sortBy: 'price' | 'sales' | 'rating';
}

async function batchComparison(input: BatchComparisonInput) {
  // 1. 創建比價任務
  const task = await createComparisonTask({
    total_products: input.products.length,
    platforms: input.platforms,
  });

  // 2. 使用任務隊列處理（避免阻塞）
  const queue = new Bull('comparison-queue');

  for (const product of input.products) {
    await queue.add('compare-product', {
      taskId: task.id,
      product,
      platforms: input.platforms,
    });
  }

  // 3. 返回任務ID，前端可輪詢進度
  return { taskId: task.id };
}

// Worker處理
queue.process('compare-product', async (job) => {
  const { taskId, product, platforms } = job.data;

  let results;
  switch (product.type) {
    case 'url':
      results = await searchByURL({ url: product.identifier, platforms });
      break;
    case 'image':
      results = await searchByImage({ imageFile: product.identifier, platforms });
      break;
    case 'keyword':
      results = await searchByKeyword({ keyword: product.identifier, platforms });
      break;
  }

  // 儲存結果
  await savePriceRecords(results);

  // 更新任務進度
  await updateTaskProgress(taskId);

  return results;
});
```

### 4. 廠商管理模組

```typescript
// 從比價結果添加廠商
async function addVendorFromComparison(priceRecordId: string) {
  const priceRecord = await getPriceRecord(priceRecordId);

  // 檢查廠商是否已存在
  let vendor = await findVendorByUrl(priceRecord.product_url);

  if (!vendor) {
    // 自動提取廠商資訊
    const vendorInfo = await extractVendorInfo(priceRecord.product_url);

    vendor = await createVendor({
      name: vendorInfo.name,
      platform: vendorInfo.platform,
      website: vendorInfo.url,
      rating: priceRecord.rating,
    });
  }

  return vendor;
}

// 廠商評分系統
async function rateVendor(vendorId: string, rating: number, note?: string) {
  await updateVendor(vendorId, {
    rating: rating,
    notes: note,
  });

  // 記錄評分歷史
  await createVendorRating({
    vendor_id: vendorId,
    rating,
    note,
  });
}
```

### 5. 訂購追蹤模組

```typescript
// 從廠商創建訂單
async function createOrderFromVendor(input: {
  vendorId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    specs?: any;
  }>;
  shippingFee?: number;
  notes?: string;
}) {
  // 計算總金額
  const totalAmount = input.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  ) + (input.shippingFee || 0);

  // 生成訂單編號
  const orderNumber = generateOrderNumber();

  // 創建訂單
  const order = await createOrder({
    order_number: orderNumber,
    vendor_id: input.vendorId,
    total_amount: totalAmount,
    shipping_fee: input.shippingFee,
    notes: input.notes,
    status: 'pending',
  });

  // 創建訂單明細
  for (const item of input.items) {
    await createOrderItem({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      subtotal: item.quantity * item.unitPrice,
      specs: item.specs,
    });
  }

  return order;
}

// 更新訂單狀態
async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string
) {
  await updateOrder(orderId, {
    status,
    tracking_number: trackingNumber,
    ...(status === 'delivered' && { actual_delivery: new Date() }),
  });

  // 發送通知
  await sendOrderNotification(orderId, status);
}
```

---

## 🎨 前端功能頁面

### 1. 搜尋頁面
```typescript
// components/SearchInterface.tsx
function SearchInterface() {
  const [searchType, setSearchType] = useState<'url' | 'image' | 'keyword'>('keyword');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  return (
    <div className="search-container">
      {/* 搜尋方式選擇 */}
      <Tabs value={searchType} onValueChange={setSearchType}>
        <TabsList>
          <TabsTrigger value="keyword">關鍵字</TabsTrigger>
          <TabsTrigger value="url">網址</TabsTrigger>
          <TabsTrigger value="image">圖片</TabsTrigger>
        </TabsList>

        <TabsContent value="keyword">
          <KeywordSearch platforms={selectedPlatforms} />
        </TabsContent>

        <TabsContent value="url">
          <URLSearch platforms={selectedPlatforms} />
        </TabsContent>

        <TabsContent value="image">
          <ImageSearch platforms={selectedPlatforms} />
        </TabsContent>
      </Tabs>

      {/* 平台選擇 */}
      <PlatformSelector
        selected={selectedPlatforms}
        onChange={setSelectedPlatforms}
      />
    </div>
  );
}
```

### 2. 比價結果頁面
```typescript
// components/ComparisonResults.tsx
function ComparisonResults({ taskId }: { taskId: string }) {
  const { data, isLoading } = useComparisonTask(taskId);
  const [sortBy, setSortBy] = useState<'price' | 'sales'>('price');

  return (
    <div className="results-container">
      {/* 進度條 */}
      <Progress
        value={(data.completed_products / data.total_products) * 100}
      />

      {/* 排序選項 */}
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectItem value="price">價格排序</SelectItem>
        <SelectItem value="sales">銷量排序</SelectItem>
        <SelectItem value="rating">評分排序</SelectItem>
      </Select>

      {/* 結果表格 */}
      <DataTable
        columns={comparisonColumns}
        data={sortResults(data.results, sortBy)}
        onAddVendor={handleAddVendor}
        onCreateOrder={handleCreateOrder}
      />

      {/* 價格走勢圖 */}
      <PriceChart data={data.priceHistory} />
    </div>
  );
}
```

### 3. 廠商管理頁面
```typescript
// components/VendorManagement.tsx
function VendorManagement() {
  const { vendors } = useVendors();

  return (
    <div className="vendor-container">
      {/* 廠商列表 */}
      <VendorList
        vendors={vendors}
        onEdit={handleEdit}
        onRate={handleRate}
      />

      {/* 廠商詳情 */}
      <VendorDetail
        vendor={selectedVendor}
        orders={vendorOrders}
        priceHistory={vendorPriceHistory}
      />
    </div>
  );
}
```

### 4. 訂單追蹤頁面
```typescript
// components/OrderTracking.tsx
function OrderTracking() {
  const { orders } = useOrders();

  return (
    <div className="order-container">
      {/* 訂單狀態統計 */}
      <OrderStats orders={orders} />

      {/* 訂單列表 */}
      <OrderList
        orders={orders}
        onUpdateStatus={handleUpdateStatus}
        onViewDetails={handleViewDetails}
      />

      {/* 物流追蹤 */}
      <ShippingTracker
        trackingNumber={selectedOrder?.tracking_number}
      />
    </div>
  );
}
```

---

## 🔐 安全性考慮

### 1. 爬蟲防護
- 使用代理IP池，避免IP被封鎖
- 添加隨機延遲，模擬真實用戶行為
- 使用User-Agent輪換
- 支持驗證碼識別（2Captcha/Anti-Captcha）

### 2. 數據安全
- 廠商聯絡資訊加密存儲
- API使用JWT認證
- Rate limiting防止濫用
- 數據定期備份

### 3. 隱私保護
- 用戶數據隔離
- GDPR合規
- 搜尋歷史自動清理選項

---

## 📊 進階功能

### 1. 價格監控與通知
```typescript
// 設定價格提醒
async function setPriceAlert(productId: string, targetPrice: number) {
  await createPriceAlert({
    product_id: productId,
    target_price: targetPrice,
    notification_methods: ['email', 'push'],
  });

  // Cron job每小時檢查
  cron.schedule('0 * * * *', async () => {
    const alerts = await getActivePriceAlerts();
    for (const alert of alerts) {
      const currentPrice = await getCurrentPrice(alert.product_id);
      if (currentPrice <= alert.target_price) {
        await sendPriceAlert(alert);
      }
    }
  });
}
```

### 2. 歷史價格分析
- 價格走勢圖表
- 最低價格提示
- 價格波動分析
- 最佳購買時機預測

### 3. 批量匯入/匯出
- CSV匯入商品列表
- Excel匯出比價結果
- 訂單數據匯出

### 4. API對接
```typescript
// 提供RESTful API
app.post('/api/v1/compare', async (req, res) => {
  const { products, platforms, sortBy } = req.body;
  const task = await batchComparison({ products, platforms, sortBy });
  res.json({ taskId: task.taskId });
});

app.get('/api/v1/compare/:taskId', async (req, res) => {
  const task = await getComparisonTask(req.params.taskId);
  res.json(task);
});
```

---

## 🚀 實施階段

### Phase 1: MVP (4-6週)
- [ ] 基礎搜尋功能（關鍵字）
- [ ] 2-3個主要平台爬蟲
- [ ] 簡單比價結果顯示
- [ ] 基礎廠商記錄

### Phase 2: 核心功能 (6-8週)
- [ ] URL與圖片搜尋
- [ ] 5+平台支持
- [ ] 批量比價功能
- [ ] 完整廠商管理系統
- [ ] 訂單追蹤

### Phase 3: 進階功能 (4-6週)
- [ ] 價格監控與提醒
- [ ] 歷史價格分析
- [ ] 數據匯入/匯出
- [ ] API開放

### Phase 4: 優化 (持續)
- [ ] 性能優化
- [ ] 更多平台支持
- [ ] AI智能推薦
- [ ] 移動端App

---

## 💰 成本估算

### 服務器成本
- **前端託管**: Vercel Pro ($20/月)
- **後端服務**: Railway ($20-50/月)
- **數據庫**: Supabase Pro ($25/月)
- **Redis快取**: Upstash ($10/月)

### 第三方服務
- **圖片識別**: Google Vision API (~$15/1000次)
- **代理IP**: Bright Data (~$50/月)
- **驗證碼識別**: 2Captcha (~$3/1000次)

### 總計
約 **$150-200/月** (中等流量)

---

## 📝 注意事項

1. **法律合規**: 確保爬蟲遵守各平台的robots.txt和服務條款
2. **反爬策略**: 持續更新爬蟲邏輯以應對平台反爬機制
3. **數據準確性**: 定期驗證爬取數據的準確性
4. **擴展性**: 使用微服務架構便於後續擴展
5. **監控**: 設置完善的錯誤監控和日誌系統

---

## 🎯 成功指標

- 支持平台數量: 目標10+
- 搜尋準確率: >90%
- 價格更新頻率: 每4-6小時
- 批量比價速度: 100個商品<5分鐘
- 系統可用性: >99.5%

---

## 📚 相關文檔

- [API文檔](./API_DOCUMENTATION.md)
- [爬蟲開發指南](./CRAWLER_GUIDE.md)
- [部署指南](./DEPLOYMENT_GUIDE.md)
- [維護手冊](./MAINTENANCE_GUIDE.md)

---

**更新日期**: 2025-11-20
**版本**: 1.0.0
