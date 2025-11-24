import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseCrawler, ProductResult, SearchFilters } from './base';

export class MomoCrawler extends BaseCrawler {
  platformName = 'Momo';
  baseUrl = 'https://www.momoshop.com.tw';

  async search(keyword: string, filters?: SearchFilters): Promise<ProductResult[]> {
    return this.retry(async () => {
      const url = this.buildSearchUrl(keyword, filters);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'zh-TW,zh;q=0.9',
        },
        timeout: 15000,
      });

      await this.randomDelay();

      return this.parseSearchResults(response.data);
    });
  }

  async getProductDetails(url: string): Promise<ProductResult | null> {
    return this.retry(async () => {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'text/html',
        },
        timeout: 15000,
      });

      await this.randomDelay();

      return this.parseProductDetails(response.data, url);
    });
  }

  protected buildSearchUrl(keyword: string, filters?: SearchFilters): string {
    const encodedKeyword = encodeURIComponent(keyword);
    const sortType = filters?.sortBy === 'price' ? 'priceAsc' :
                    filters?.sortBy === 'sales' ? 'salesQty' :
                    'relevant';

    return `${this.baseUrl}/search/searchShop.jsp?keyword=${encodedKeyword}&searchType=${sortType}&page=${filters?.page || 1}`;
  }

  private parseSearchResults(html: string): ProductResult[] {
    const $ = cheerio.load(html);
    const results: ProductResult[] = [];

    $('.listArea .productInfo, .goodsItemLi').each((_, element) => {
      try {
        const $elem = $(element);

        const name = this.cleanText(
          $elem.find('.prdName, h3').text()
        );

        const priceText = $elem.find('.price, .money').first().text();
        const price = this.parsePrice(priceText);

        const originalPriceText = $elem.find('.del, .originalPrice').text();
        const originalPrice = originalPriceText ? this.parsePrice(originalPriceText) : undefined;

        const productUrl = $elem.find('a').first().attr('href');
        const imageUrl = $elem.find('img').first().attr('src') ||
                        $elem.find('img').first().attr('data-src');

        // Extract sales info if available
        const salesText = $elem.find('.sellCount, .sales').text();
        const salesVolume = this.parseSales(salesText);

        if (name && price && productUrl) {
          results.push({
            name,
            price,
            originalPrice,
            imageUrl: imageUrl?.startsWith('http') ? imageUrl :
                     imageUrl ? `https:${imageUrl}` : undefined,
            productUrl: productUrl.startsWith('http') ? productUrl :
                       `${this.baseUrl}${productUrl}`,
            platform: this.platformName,
            salesVolume,
            stockStatus: 'available',
            shippingFee: 0,
          });
        }
      } catch (error) {
        console.warn('Error parsing Momo product:', error);
      }
    });

    return results;
  }

  private parseProductDetails(html: string, url: string): ProductResult | null {
    const $ = cheerio.load(html);

    try {
      const name = this.cleanText($('.prdName, .prodInfoName h1').first().text());
      const priceText = $('.price, .prdPrice').first().text();
      const price = this.parsePrice(priceText);

      const originalPriceText = $('.del, .originalPrice').text();
      const originalPrice = originalPriceText ? this.parsePrice(originalPriceText) : undefined;

      const imageUrl = $('.mainPic img, .prodImg img').first().attr('src');

      // Extract rating
      const ratingText = $('.rating, .score').text();
      const rating = ratingText ? parseFloat(ratingText.replace(/[^\d.]/g, '')) : undefined;

      // Extract review count
      const reviewText = $('.commentNum, .reviewCount').text();
      const reviewCount = reviewText ? parseInt(reviewText.replace(/[^\d]/g, '')) : undefined;

      // Extract specifications
      const specs: Record<string, any> = {};
      $('.specification tr, .prodSpec li').each((_, row) => {
        const $row = $(row);
        const key = this.cleanText($row.find('th, .specName').text());
        const value = this.cleanText($row.find('td, .specValue').text());
        if (key && value) {
          specs[key] = value;
        }
      });

      if (!name || !price) {
        return null;
      }

      return {
        name,
        price,
        originalPrice,
        imageUrl: imageUrl?.startsWith('http') ? imageUrl :
                 imageUrl ? `https:${imageUrl}` : undefined,
        productUrl: url,
        platform: this.platformName,
        rating,
        reviewCount,
        stockStatus: 'available',
        shippingFee: 0,
        specs,
      };
    } catch (error) {
      console.warn('Error parsing Momo product details:', error);
      return null;
    }
  }
}
