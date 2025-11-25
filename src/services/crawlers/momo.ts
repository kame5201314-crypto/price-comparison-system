import { BaseCrawler, ProductResult, SearchFilters } from './base';

export class MomoCrawler extends BaseCrawler {
  platformName = 'Momo';
  baseUrl = 'https://www.momoshop.com.tw';

  async search(keyword: string, filters?: SearchFilters): Promise<ProductResult[]> {
    console.log(`🛒 搜尋 momo: ${keyword}`);

    // 由於 CORS 限制，返回模擬數據
    return this.generateMockResults(keyword, filters);
  }

  async getProductDetails(url: string): Promise<ProductResult | null> {
    console.log(`🛒 獲取 momo 商品詳情: ${url}`);

    const productId = url.match(/i_code=(\w+)/)?.[1] || 'Unknown';

    return {
      name: `momo 商品 - ${productId}`,
      price: Math.floor(Math.random() * 1000) + 300,
      originalPrice: Math.floor(Math.random() * 500) + 1400,
      imageUrl: 'https://img.momomall.com.tw/placeholder',
      productUrl: url,
      platform: this.platformName,
      rating: 4.6,
      reviewCount: Math.floor(Math.random() * 800),
      salesVolume: Math.floor(Math.random() * 4000),
      stockStatus: 'available',
      vendorName: 'momo購物網',
    };
  }

  protected buildSearchUrl(keyword: string, filters?: SearchFilters): string {
    return `${this.baseUrl}/search/searchShop.jsp?keyword=${encodeURIComponent(keyword)}`;
  }

  private generateMockResults(keyword: string, filters?: SearchFilters): ProductResult[] {
    const count = filters?.limit || 10;
    const results: ProductResult[] = [];

    const mockProducts = [
      { name: `【momo獨家】${keyword} 超值優惠`, basePrice: 399 },
      { name: `${keyword} 限時搶購`, basePrice: 499 },
      { name: `${keyword} 熱銷排行榜`, basePrice: 599 },
      { name: `【天天特價】${keyword}`, basePrice: 299 },
      { name: `${keyword} 品牌精選`, basePrice: 449 },
      { name: `${keyword} 滿額折扣`, basePrice: 549 },
      { name: `${keyword} 新品首發`, basePrice: 699 },
      { name: `${keyword} 會員專享`, basePrice: 379 },
      { name: `${keyword} 暢銷商品`, basePrice: 429 },
      { name: `${keyword} 超低折扣`, basePrice: 259 },
    ];

    for (let i = 0; i < Math.min(count, mockProducts.length); i++) {
      const product = mockProducts[i];
      const price = product.basePrice + Math.floor(Math.random() * 250);
      const originalPrice = price + Math.floor(Math.random() * 350);

      results.push({
        name: product.name,
        price,
        originalPrice,
        imageUrl: `https://via.placeholder.com/300x300/E91E63/FFFFFF?text=${encodeURIComponent(keyword)}`,
        productUrl: `https://www.momoshop.com.tw/goods/GoodsDetail.jsp?i_code=MOMO${i + 1}`,
        platform: this.platformName,
        rating: 4.2 + Math.random() * 0.6,
        reviewCount: Math.floor(Math.random() * 1500),
        salesVolume: Math.floor(Math.random() * 8000),
        stockStatus: 'available',
        shippingFee: Math.random() > 0.6 ? 0 : 80,
        vendorName: 'momo購物網',
        specs: {
          keyword,
          deliveryTime: '1-3天到貨',
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
