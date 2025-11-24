import { BaseCrawler, ProductResult, SearchFilters } from './base';
import { ShopeeCrawler } from './shopee';
import { PChomeCrawler } from './pchome';
import { MomoCrawler } from './momo';

// Available crawlers
export const crawlers: Record<string, BaseCrawler> = {
  shopee: new ShopeeCrawler(),
  pchome: new PChomeCrawler(),
  momo: new MomoCrawler(),
};

export const platformNames = {
  shopee: '蝦皮購物',
  pchome: 'PChome 24h',
  momo: 'momo購物網',
};

/**
 * Get crawler by platform name
 */
export function getCrawler(platform: string): BaseCrawler | null {
  return crawlers[platform.toLowerCase()] || null;
}

/**
 * Get all available platforms
 */
export function getAvailablePlatforms(): string[] {
  return Object.keys(crawlers);
}

/**
 * Search across multiple platforms
 */
export async function searchMultiplePlatforms(
  keyword: string,
  platforms: string[],
  filters?: SearchFilters
): Promise<Map<string, ProductResult[]>> {
  const results = new Map<string, ProductResult[]>();

  const promises = platforms.map(async (platform) => {
    const crawler = getCrawler(platform);
    if (!crawler) {
      console.warn(`Crawler not found for platform: ${platform}`);
      return;
    }

    try {
      const platformResults = await crawler.search(keyword, filters);
      results.set(platform, platformResults);
    } catch (error) {
      console.error(`Error searching ${platform}:`, error);
      results.set(platform, []);
    }
  });

  await Promise.allSettled(promises);

  return results;
}

/**
 * Get product details from URL across all platforms
 */
export async function getProductFromUrl(url: string): Promise<ProductResult | null> {
  // Detect platform from URL
  let platform: string | null = null;

  if (url.includes('shopee.tw')) {
    platform = 'shopee';
  } else if (url.includes('pchome.com.tw')) {
    platform = 'pchome';
  } else if (url.includes('momoshop.com.tw')) {
    platform = 'momo';
  }

  if (!platform) {
    throw new Error('Unsupported platform URL');
  }

  const crawler = getCrawler(platform);
  if (!crawler) {
    throw new Error(`Crawler not found for platform: ${platform}`);
  }

  return await crawler.getProductDetails(url);
}

/**
 * Compare prices for a product across platforms
 */
export async function comparePrices(
  productName: string,
  platforms: string[]
): Promise<ProductResult[]> {
  const results = await searchMultiplePlatforms(productName, platforms);

  // Flatten all results into a single array
  const allProducts: ProductResult[] = [];
  results.forEach((products) => {
    allProducts.push(...products);
  });

  // Sort by price (ascending)
  return allProducts.sort((a, b) => a.price - b.price);
}

export type { ProductResult, SearchFilters } from './base';
export { BaseCrawler } from './base';
