// Base Crawler Class
export interface ProductResult {
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  productUrl: string;
  platform: string;
  rating?: number;
  reviewCount?: number;
  salesVolume?: number;
  stockStatus?: string;
  shippingFee?: number;
  vendorName?: string;
  specs?: Record<string, any>;
}

export interface SearchFilters {
  priceMin?: number;
  priceMax?: number;
  minSales?: number;
  minRating?: number;
  sortBy?: 'price' | 'sales' | 'rating' | 'relevance';
  page?: number;
  limit?: number;
}

export abstract class BaseCrawler {
  abstract platformName: string;
  abstract baseUrl: string;

  /**
   * Search products by keyword
   */
  abstract search(keyword: string, filters?: SearchFilters): Promise<ProductResult[]>;

  /**
   * Get product details from URL
   */
  abstract getProductDetails(url: string): Promise<ProductResult | null>;

  /**
   * Build search URL with filters
   */
  protected abstract buildSearchUrl(keyword: string, filters?: SearchFilters): string;

  /**
   * Clean and normalize price string to number
   */
  protected parsePrice(priceStr: string): number {
    if (!priceStr) return 0;

    // Remove currency symbols and commas
    const cleaned = priceStr
      .replace(/[^\d.]/g, '')
      .trim();

    return parseFloat(cleaned) || 0;
  }

  /**
   * Parse sales volume from string
   */
  protected parseSales(salesStr: string): number {
    if (!salesStr) return 0;

    const cleaned = salesStr.toLowerCase();

    // Handle "1.2k" format
    if (cleaned.includes('k')) {
      return parseFloat(cleaned.replace(/[^\d.]/g, '')) * 1000;
    }

    // Handle "1.2萬" format
    if (cleaned.includes('萬') || cleaned.includes('万')) {
      return parseFloat(cleaned.replace(/[^\d.]/g, '')) * 10000;
    }

    return parseFloat(cleaned.replace(/[^\d]/g, '')) || 0;
  }

  /**
   * Clean text content
   */
  protected cleanText(text: string | null | undefined): string {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ');
  }

  /**
   * Add random delay to avoid rate limiting
   */
  protected async randomDelay(min: number = 1000, max: number = 3000): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Get random user agent
   */
  protected getRandomUserAgent(): string {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    ];

    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  /**
   * Retry logic for failed requests
   */
  protected async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 2000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${i + 1} failed:`, error);

        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }
}
