import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseCrawler, ProductResult, SearchFilters } from './base';

export class PChomeCrawler extends BaseCrawler {
  platformName = 'PChome';
  baseUrl = 'https://24h.pchome.com.tw';

  async search(keyword: string, filters?: SearchFilters): Promise<ProductResult[]> {
    return this.retry(async () => {
      const url = this.buildSearchUrl(keyword, filters);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml',
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
    const sortParam = filters?.sortBy === 'price' ? 'price/asc' :
                     filters?.sortBy === 'sales' ? 'sale/dc' :
                     'rnk/dc';

    return `${this.baseUrl}/search/v3.3/?q=${encodedKeyword}&sort=${sortParam}`;
  }

  private parseSearchResults(html: string): ProductResult[] {
    const $ = cheerio.load(html);
    const results: ProductResult[] = [];

    $('#ProductContainer .prod_item, .c-prodInfo').each((_, element) => {
      try {
        const $elem = $(element);

        const name = this.cleanText(
          $elem.find('.prod_name, .c-prodInfo__title').text()
        );

        const priceText = $elem.find('.price, .c-prodInfo__price').first().text();
        const price = this.parsePrice(priceText);

        const originalPriceText = $elem.find('.price_org, .c-prodInfo__price--original').text();
        const originalPrice = originalPriceText ? this.parsePrice(originalPriceText) : undefined;

        const productUrl = $elem.find('a').first().attr('href');
        const imageUrl = $elem.find('img').first().attr('src') ||
                        $elem.find('img').first().attr('data-src');

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
            stockStatus: 'available',
            shippingFee: 0, // PChome 24h usually free shipping
          });
        }
      } catch (error) {
        console.warn('Error parsing PChome product:', error);
      }
    });

    return results;
  }

  private parseProductDetails(html: string, url: string): ProductResult | null {
    const $ = cheerio.load(html);

    try {
      const name = this.cleanText($('#ProdInfo h1, .prod-name').first().text());
      const priceText = $('#ProdInfo .price, .prod-price').first().text();
      const price = this.parsePrice(priceText);

      const originalPriceText = $('.price_org, .prod-price-original').text();
      const originalPrice = originalPriceText ? this.parsePrice(originalPriceText) : undefined;

      const imageUrl = $('#ProdInfo img, .prod-img img').first().attr('src');

      const specs: Record<string, any> = {};
      $('.prod-spec-table tr, .spec-item').each((_, row) => {
        const $row = $(row);
        const key = this.cleanText($row.find('th, .spec-name').text());
        const value = this.cleanText($row.find('td, .spec-value').text());
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
        stockStatus: 'available',
        shippingFee: 0,
        specs,
      };
    } catch (error) {
      console.warn('Error parsing PChome product details:', error);
      return null;
    }
  }
}
