import axios from 'axios';
import { BaseCrawler, ProductResult, SearchFilters } from './base';

export class ShopeeCrawler extends BaseCrawler {
  platformName = 'Shopee';
  baseUrl = 'https://shopee.tw';

  async search(keyword: string, filters?: SearchFilters): Promise<ProductResult[]> {
    return this.retry(async () => {
      const url = this.buildSearchUrl(keyword, filters);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'application/json',
          'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
          'Referer': 'https://shopee.tw/',
        },
        timeout: 15000,
      });

      await this.randomDelay();

      return this.parseSearchResults(response.data);
    });
  }

  async getProductDetails(url: string): Promise<ProductResult | null> {
    return this.retry(async () => {
      // Extract shop and item ID from URL
      const match = url.match(/i\.(\d+)\.(\d+)/);
      if (!match) {
        throw new Error('Invalid Shopee URL');
      }

      const [, shopId, itemId] = match;
      const apiUrl = `https://shopee.tw/api/v4/item/get?shopid=${shopId}&itemid=${itemId}`;

      const response = await axios.get(apiUrl, {
        headers: {
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'application/json',
          'Referer': url,
        },
        timeout: 15000,
      });

      await this.randomDelay();

      return this.parseProductDetails(response.data, url);
    });
  }

  protected buildSearchUrl(keyword: string, filters?: SearchFilters): string {
    const params = new URLSearchParams({
      by: filters?.sortBy === 'price' ? 'price' :
          filters?.sortBy === 'sales' ? 'sales' :
          filters?.sortBy === 'rating' ? 'ctime' : 'relevancy',
      keyword: keyword,
      limit: String(filters?.limit || 60),
      newest: String((filters?.page || 0) * (filters?.limit || 60)),
      order: filters?.sortBy === 'price' ? 'asc' : 'desc',
    });

    return `https://shopee.tw/api/v4/search/search_items?${params}`;
  }

  private parseSearchResults(data: any): ProductResult[] {
    if (!data?.items || !Array.isArray(data.items)) {
      return [];
    }

    return data.items
      .filter((item: any) => item?.item_basic)
      .map((item: any): ProductResult => {
        const itemBasic = item.item_basic;
        const price = itemBasic.price / 100000; // Shopee price is in smallest unit
        const originalPrice = itemBasic.price_before_discount
          ? itemBasic.price_before_discount / 100000
          : undefined;

        return {
          name: this.cleanText(itemBasic.name),
          price,
          originalPrice,
          imageUrl: itemBasic.image
            ? `https://cf.shopee.tw/file/${itemBasic.image}`
            : undefined,
          productUrl: `https://shopee.tw/product/${itemBasic.shopid}/${itemBasic.itemid}`,
          platform: this.platformName,
          rating: itemBasic.item_rating?.rating_star
            ? itemBasic.item_rating.rating_star / 5 * 5
            : undefined,
          reviewCount: itemBasic.item_rating?.rating_count?.[0] || 0,
          salesVolume: itemBasic.historical_sold || itemBasic.sold || 0,
          stockStatus: itemBasic.stock > 0 ? 'available' : 'out_of_stock',
          shippingFee: 0, // Shopee often has free shipping
          vendorName: itemBasic.shop_location || undefined,
          specs: {
            shopId: itemBasic.shopid,
            itemId: itemBasic.itemid,
            stock: itemBasic.stock,
            liked_count: itemBasic.liked_count,
            brand: itemBasic.brand,
            shop_location: itemBasic.shop_location,
          },
        };
      });
  }

  private parseProductDetails(data: any, url: string): ProductResult | null {
    if (!data?.data) {
      return null;
    }

    const item = data.data;
    const price = item.price / 100000;
    const originalPrice = item.price_before_discount
      ? item.price_before_discount / 100000
      : undefined;

    return {
      name: this.cleanText(item.name),
      price,
      originalPrice,
      imageUrl: item.image ? `https://cf.shopee.tw/file/${item.image}` : undefined,
      productUrl: url,
      platform: this.platformName,
      rating: item.item_rating?.rating_star
        ? item.item_rating.rating_star / 5 * 5
        : undefined,
      reviewCount: item.item_rating?.rating_count?.[0] || 0,
      salesVolume: item.historical_sold || item.sold || 0,
      stockStatus: item.stock > 0 ? 'available' : 'out_of_stock',
      shippingFee: 0,
      vendorName: item.shop?.name || undefined,
      specs: {
        shopId: item.shopid,
        itemId: item.itemid,
        stock: item.stock,
        description: item.description,
        category: item.categories?.map((c: any) => c.display_name).join(' > '),
        attributes: item.attributes,
      },
    };
  }
}
