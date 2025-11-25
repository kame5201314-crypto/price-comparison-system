import { BaseCrawler, ProductResult, SearchFilters } from './base';

export class PChomeCrawler extends BaseCrawler {
  platformName = 'PChome';
  baseUrl = 'https://24h.pchome.com.tw';

  async search(keyword: string, filters?: SearchFilters): Promise<ProductResult[]> {
    console.log(`📦 搜尋 PChome: ${keyword}`);

    // 由於 CORS 限制，返回模擬數據
    return this.generateMockResults(keyword, filters);
  }

  async getProductDetails(url: string): Promise<ProductResult | null> {
    console.log(`📦 獲取 PChome 商品詳情: ${url}`);

    const productId = url.match(/prod\/([A-Z0-9-]+)/)?.[1] || 'Unknown';

    return {
      name: `PChome 商品 - ${productId}`,
      price: Math.floor(Math.random() * 1000) + 200,
      originalPrice: Math.floor(Math.random() * 500) + 1300,
      imageUrl: 'https://cs-a.ecimg.tw/placeholder',
      productUrl: url,
      platform: this.platformName,
      rating: 4.3,
      reviewCount: Math.floor(Math.random() * 500),
      salesVolume: Math.floor(Math.random() * 3000),
      stockStatus: 'available',
      vendorName: 'PChome 24h',
    };
  }

  protected buildSearchUrl(keyword: string, filters?: SearchFilters): string {
    return `${this.baseUrl}/search/?q=${encodeURIComponent(keyword)}`;
  }

  private generateMockResults(keyword: string, filters?: SearchFilters): ProductResult[] {
    const count = filters?.limit || 10;
    const results: ProductResult[] = [];

    const mockProducts = [
      { name: `【PChome】${keyword} 24h快速到貨`, basePrice: 350 },
      { name: `【熱銷】${keyword} 限時優惠`, basePrice: 450 },
      { name: `${keyword} 官方授權`, basePrice: 550 },
      { name: `${keyword} 超值特惠組`, basePrice: 299 },
      { name: `${keyword} 精選商品`, basePrice: 399 },
      { name: `【獨家】${keyword} 特價中`, basePrice: 499 },
      { name: `${keyword} 品質保證`, basePrice: 599 },
      { name: `${keyword} 新品推薦`, basePrice: 649 },
      { name: `${keyword} 熱門首選`, basePrice: 379 },
      { name: `${keyword} 超低價格`, basePrice: 249 },
    ];

    for (let i = 0; i < Math.min(count, mockProducts.length); i++) {
      const product = mockProducts[i];
      const price = product.basePrice + Math.floor(Math.random() * 200);
      const originalPrice = price + Math.floor(Math.random() * 400);

      results.push({
        name: product.name,
        price,
        originalPrice,
        imageUrl: `https://via.placeholder.com/300x300/2196F3/FFFFFF?text=${encodeURIComponent(keyword)}`,
        productUrl: `https://24h.pchome.com.tw/prod/PROD-${i + 1}`,
        platform: this.platformName,
        rating: 4 + Math.random() * 0.8,
        reviewCount: Math.floor(Math.random() * 1000),
        salesVolume: Math.floor(Math.random() * 5000),
        stockStatus: 'available',
        shippingFee: 0,
        vendorName: 'PChome 24h購物',
        specs: {
          keyword,
          deliveryTime: '24小時到貨',
          searchRank: i + 1,
        },
      });
    }

    if (filters?.sortBy === 'price') {
      results.sort((a, b) => a.price - b.price);
    } else if (filters?.sortBy === 'sales') {
      results.sort((a, b) => (b.salesVolume || 0) - (a.salesVolume || 0));
    }

    return results;
  }
}
