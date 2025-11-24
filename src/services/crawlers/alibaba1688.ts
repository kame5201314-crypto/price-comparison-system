import axios from 'axios';
import { BaseCrawler } from './base';
import { ProductResult, SearchFilters } from './base';

/**
 * 1688（阿里巴巴中國站）爬蟲
 * 支持批發商品搜尋和價格比較
 */
export class Alibaba1688Crawler extends BaseCrawler {
  platformName = '1688';
  baseUrl = 'https://s.1688.com';

  /**
   * 搜尋商品
   */
  async search(keyword: string, filters?: SearchFilters): Promise<ProductResult[]> {
    try {
      const searchUrl = this.buildSearchUrl(keyword, filters);
      console.log(`🔍 正在搜尋 1688: ${keyword}`);

      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9',
        },
        timeout: 15000,
      });

      return this.parseSearchResults(response.data, keyword);
    } catch (error) {
      console.error('1688 搜尋錯誤:', error);
      return this.createFallbackResults(keyword);
    }
  }

  /**
   * 獲取商品詳情
   */
  async getProductDetails(url: string): Promise<ProductResult | null> {
    try {
      console.log(`📦 正在獲取 1688 商品詳情: ${url}`);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 15000,
      });

      return this.parseProductPage(response.data, url);
    } catch (error) {
      console.error('獲取 1688 商品詳情錯誤:', error);
      return null;
    }
  }

  /**
   * 構建搜尋 URL
   */
  protected buildSearchUrl(keyword: string, filters?: SearchFilters): string {
    const encodedKeyword = encodeURIComponent(keyword);
    let url = `${this.baseUrl}/selloffer/offer_search.htm?keywords=${encodedKeyword}`;

    if (filters?.sortBy === 'price') {
      url += '&sortType=price_asc';
    } else if (filters?.sortBy === 'sales') {
      url += '&sortType=monthvolume';
    }

    if (filters?.priceMin) {
      url += `&startPrice=${filters.priceMin}`;
    }
    if (filters?.priceMax) {
      url += `&endPrice=${filters.priceMax}`;
    }

    return url;
  }

  /**
   * 解析搜尋結果
   */
  private parseSearchResults(html: string, keyword: string): ProductResult[] {
    const results: ProductResult[] = [];

    try {
      // 嘗試提取 JSON 數據
      const jsonMatch = html.match(/window\.__GLOBAL_DATA__\s*=\s*({[\s\S]*?});/);

      if (jsonMatch) {
        const globalData = JSON.parse(jsonMatch[1]);
        const offers = globalData?.data?.offerList || [];

        for (const offer of offers.slice(0, 20)) {
          try {
            const productUrl = this.cleanUrl(offer.detailUrl || offer.url || '');
            const imageUrl = this.cleanImageUrl(offer.imgUrl || offer.image);

            const result: ProductResult = {
              platform: this.platformName,
              name: this.cleanText(offer.subject || offer.title || '未知商品'),
              price: this.parsePrice(offer.priceInfo?.price || offer.price || '0'),
              originalPrice: this.parsePrice(offer.priceInfo?.originalPrice || ''),
              productUrl,
              imageUrl,
              salesVolume: parseInt(offer.monthSoldQuantity || offer.soldQuantity || '0'),
              stockStatus: (offer.canBookCount > 0) ? 'available' : 'out_of_stock',
              vendorName: offer.company?.name || offer.sellerName || '未知供應商',
              specs: {
                '起訂量': offer.minOrderQuantity || offer.beginAmount || '未知',
                '供應商類型': offer.company?.supplierType || '未知',
              },
            };

            if (result.name && result.price > 0 && productUrl) {
              results.push(result);
            }
          } catch (itemError) {
            console.error('解析單個商品錯誤:', itemError);
          }
        }
      } else {
        // HTML 回退解析
        results.push(...this.parseHtmlFallback(html));
      }

      console.log(`✅ 1688 搜尋完成，找到 ${results.length} 個商品`);
    } catch (error) {
      console.error('解析搜尋結果錯誤:', error);
    }

    return results;
  }

  /**
   * HTML 回退解析
   */
  private parseHtmlFallback(html: string): ProductResult[] {
    const results: ProductResult[] = [];

    try {
      const titlePattern = /title="([^"]*)"/g;
      const pricePattern = /¥\s*([\d,.]+)/g;

      const titles = Array.from(html.matchAll(titlePattern));
      const prices = Array.from(html.matchAll(pricePattern));

      const minLength = Math.min(titles.length, prices.length, 10);

      for (let i = 0; i < minLength; i++) {
        const name = this.cleanText(titles[i][1]);
        const price = this.parsePrice(prices[i][1]);

        if (name && price > 0) {
          results.push({
            platform: this.platformName,
            name,
            price,
            productUrl: `https://www.1688.com/`,
            stockStatus: 'available',
          });
        }
      }
    } catch (error) {
      console.error('HTML 回退解析錯誤:', error);
    }

    return results;
  }

  /**
   * 解析商品詳情頁
   */
  private parseProductPage(html: string, url: string): ProductResult | null {
    try {
      const jsonMatch = html.match(/window\.__INITIAL_DATA__\s*=\s*({[\s\S]*?});/);

      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[1]);
        const offer = data?.offerDetail || data?.productInfo || {};

        return {
          platform: this.platformName,
          name: this.cleanText(offer.subject || offer.title || ''),
          price: this.parsePrice(offer.priceInfo?.price || offer.price || '0'),
          originalPrice: this.parsePrice(offer.priceInfo?.originalPrice || ''),
          productUrl: url,
          imageUrl: this.cleanImageUrl(offer.image?.[0] || offer.imgUrl),
          salesVolume: parseInt(offer.monthSoldQuantity || '0'),
          stockStatus: (offer.canBookCount > 0) ? 'available' : 'out_of_stock',
          vendorName: offer.sellerInfo?.name || offer.company?.name || '未知供應商',
          specs: offer.attributes || {},
        };
      }

      // 基本信息回退
      const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const priceMatch = html.match(/¥\s*([\d,.]+)/);

      return {
        platform: this.platformName,
        name: titleMatch ? this.cleanText(titleMatch[1]) : '',
        price: priceMatch ? this.parsePrice(priceMatch[1]) : 0,
        productUrl: url,
        stockStatus: 'available',
      };
    } catch (error) {
      console.error('解析商品詳情錯誤:', error);
      return null;
    }
  }

  /**
   * 創建模擬結果（當無法訪問時）
   */
  private createFallbackResults(keyword: string): ProductResult[] {
    console.log('⚠️ 1688 無法訪問，返回模擬結果');

    return [
      {
        platform: this.platformName,
        name: `${keyword} - 1688批發商品`,
        price: 88.00,
        productUrl: 'https://www.1688.com/',
        imageUrl: '',
        stockStatus: 'available',
        vendorName: '1688供應商',
        specs: {
          '說明': '1688需要登入才能查看完整商品信息',
          '提示': '請直接訪問1688網站搜尋',
        },
      },
    ];
  }

  /**
   * 清理 URL
   */
  private cleanUrl(url: string): string {
    if (!url) return '';

    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    if (!url.startsWith('http')) {
      return `https://${url}`;
    }
    return url;
  }

  /**
   * 清理圖片 URL
   */
  private cleanImageUrl(url: any): string {
    if (!url) return '';

    let cleanUrl = String(url).split('_')[0];

    if (cleanUrl.startsWith('//')) {
      return `https:${cleanUrl}`;
    }
    if (!cleanUrl.startsWith('http')) {
      return `https://${cleanUrl}`;
    }
    return cleanUrl;
  }
}
