import { BaseCrawler, ProductResult, SearchFilters } from './base';

export class ShopeeCrawler extends BaseCrawler {
  platformName = 'Shopee';
  baseUrl = 'https://shopee.tw';

  async search(keyword: string, filters?: SearchFilters): Promise<ProductResult[]> {
    console.log(`🛍️ 搜尋蝦皮: ${keyword}`);

    // 由於 CORS 限制，在瀏覽器端無法直接訪問 Shopee API
    // 返回模擬數據以展示功能
    return this.generateMockResults(keyword, filters);
  }

  async getProductDetails(url: string): Promise<ProductResult | null> {
    console.log(`📦 獲取蝦皮商品詳情: ${url}`);

    // 從 URL 提取商品信息
    const match = url.match(/i\.(\d+)\.(\d+)/) || url.match(/product\/(\d+)\/(\d+)/);

    return {
      name: `蝦皮商品 - ${match ? match[2] : 'Unknown'}`,
      price: Math.floor(Math.random() * 1000) + 100,
      originalPrice: Math.floor(Math.random() * 500) + 1200,
      imageUrl: 'https://cf.shopee.tw/file/placeholder',
      productUrl: url,
      platform: this.platformName,
      rating: 4.5,
      reviewCount: Math.floor(Math.random() * 1000),
      salesVolume: Math.floor(Math.random() * 5000),
      stockStatus: 'available',
      vendorName: '蝦皮賣家',
    };
  }

  protected buildSearchUrl(keyword: string, filters?: SearchFilters): string {
    const params = new URLSearchParams({
      keyword: keyword,
      limit: String(filters?.limit || 20),
    });
    return `${this.baseUrl}/search?${params}`;
  }

  private generateMockResults(keyword: string, filters?: SearchFilters): ProductResult[] {
    const count = filters?.limit || 10;
    const results: ProductResult[] = [];

    const mockProducts = [
      { name: `${keyword} 熱銷款`, basePrice: 299 },
      { name: `${keyword} 超值組合`, basePrice: 399 },
      { name: `${keyword} 限時特價`, basePrice: 199 },
      { name: `${keyword} 精選推薦`, basePrice: 499 },
      { name: `${keyword} 人氣商品`, basePrice: 349 },
      { name: `${keyword} 新品上市`, basePrice: 599 },
      { name: `${keyword} 優惠促銷`, basePrice: 249 },
      { name: `${keyword} 經典款式`, basePrice: 449 },
      { name: `${keyword} 熱門選擇`, basePrice: 329 },
      { name: `${keyword} 超值特惠`, basePrice: 279 },
    ];

    for (let i = 0; i < Math.min(count, mockProducts.length); i++) {
      const product = mockProducts[i];
      const price = product.basePrice + Math.floor(Math.random() * 200);
      const originalPrice = price + Math.floor(Math.random() * 300);

      results.push({
        name: product.name,
        price,
        originalPrice,
        imageUrl: `https://via.placeholder.com/300x300/FF5722/FFFFFF?text=${encodeURIComponent(keyword)}`,
        productUrl: `https://shopee.tw/search?keyword=${encodeURIComponent(keyword)}&item=${i}`,
        platform: this.platformName,
        rating: 4 + Math.random(),
        reviewCount: Math.floor(Math.random() * 2000),
        salesVolume: Math.floor(Math.random() * 10000),
        stockStatus: 'available',
        shippingFee: Math.random() > 0.5 ? 0 : 60,
        vendorName: `蝦皮賣家${i + 1}`,
        specs: {
          keyword,
          searchRank: i + 1,
        },
      });
    }

    // 根據排序條件排序
    if (filters?.sortBy === 'price') {
      results.sort((a, b) => a.price - b.price);
    } else if (filters?.sortBy === 'sales') {
      results.sort((a, b) => (b.salesVolume || 0) - (a.salesVolume || 0));
    }

    return results;
  }
}
