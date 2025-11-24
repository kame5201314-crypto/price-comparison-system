import { supabase, ComparisonTask, Product, PriceRecord } from '../lib/supabase';
import {
  searchMultiplePlatforms,
  getProductFromUrl,
  ProductResult,
  SearchFilters,
} from './crawlers';
import { searchByImage } from './imageRecognition';

export interface SearchByUrlInput {
  url: string;
  platforms: string[];
}

export interface SearchByImageInput {
  imageFile: File | string;
  platforms: string[];
}

export interface SearchByKeywordInput {
  keyword: string;
  platforms: string[];
  filters?: SearchFilters;
}

export interface BatchComparisonInput {
  products: Array<{
    identifier: string; // URL, image URL, or keyword
    type: 'url' | 'image' | 'keyword';
  }>;
  platforms: string[];
  sortBy?: 'price' | 'sales' | 'rating';
}

/**
 * Search by URL
 */
export async function searchProductByUrl(
  input: SearchByUrlInput
): Promise<ProductResult[]> {
  try {
    // 1. Extract product info from URL
    const productInfo = await getProductFromUrl(input.url);

    if (!productInfo) {
      throw new Error('Unable to extract product information from URL');
    }

    // 2. Search other platforms using product name
    const results = await searchMultiplePlatforms(
      productInfo.name,
      input.platforms.filter(p => p !== productInfo.platform)
    );

    // 3. Combine results including original product
    const allResults: ProductResult[] = [productInfo];

    results.forEach((products) => {
      allResults.push(...products);
    });

    return allResults;
  } catch (error) {
    console.error('Error in searchProductByUrl:', error);
    throw error;
  }
}

/**
 * Search by image
 */
export async function searchProductByImage(
  input: SearchByImageInput
): Promise<{ keywords: string[]; results: ProductResult[] }> {
  try {
    // 1. Recognize product from image
    const recognition = await searchByImage(input.imageFile, input.platforms);

    if (!recognition.keywords || recognition.keywords.length === 0) {
      throw new Error('Unable to recognize product from image');
    }

    // 2. Use top keyword to search platforms
    const keyword = recognition.keywords[0];
    const results = await searchMultiplePlatforms(keyword, input.platforms);

    // 3. Flatten results
    const allResults: ProductResult[] = [];
    results.forEach((products) => {
      allResults.push(...products);
    });

    return {
      keywords: recognition.keywords,
      results: allResults,
    };
  } catch (error) {
    console.error('Error in searchProductByImage:', error);
    throw error;
  }
}

/**
 * Search by keyword
 */
export async function searchProductByKeyword(
  input: SearchByKeywordInput
): Promise<ProductResult[]> {
  try {
    const results = await searchMultiplePlatforms(
      input.keyword,
      input.platforms,
      input.filters
    );

    const allResults: ProductResult[] = [];
    results.forEach((products) => {
      allResults.push(...products);
    });

    return allResults;
  } catch (error) {
    console.error('Error in searchProductByKeyword:', error);
    throw error;
  }
}

/**
 * Create comparison task
 */
export async function createComparisonTask(
  input: BatchComparisonInput,
  userId: string
): Promise<ComparisonTask> {
  try {
    const { data, error } = await supabase
      .from('comparison_tasks')
      .insert({
        task_name: `Batch Comparison - ${new Date().toLocaleString()}`,
        search_type: 'keyword', // Default, will be mixed
        search_input: JSON.stringify(input.products),
        platforms: input.platforms,
        status: 'pending',
        total_products: input.products.length,
        completed_products: 0,
        failed_products: 0,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error creating comparison task:', error);
    throw error;
  }
}

/**
 * Process comparison task
 */
export async function processComparisonTask(
  taskId: string
): Promise<void> {
  try {
    // Update task status to running
    await supabase
      .from('comparison_tasks')
      .update({
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .eq('id', taskId);

    // Get task details
    const { data: task, error: taskError } = await supabase
      .from('comparison_tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (taskError || !task) throw taskError || new Error('Task not found');

    const products = JSON.parse(task.search_input) as Array<{
      identifier: string;
      type: 'url' | 'image' | 'keyword';
    }>;

    let completedCount = 0;
    let failedCount = 0;

    // Process each product
    for (const product of products) {
      try {
        let results: ProductResult[] = [];

        switch (product.type) {
          case 'url':
            results = await searchProductByUrl({
              url: product.identifier,
              platforms: task.platforms,
            });
            break;

          case 'image':
            const imageResults = await searchProductByImage({
              imageFile: product.identifier,
              platforms: task.platforms,
            });
            results = imageResults.results;
            break;

          case 'keyword':
            results = await searchProductByKeyword({
              keyword: product.identifier,
              platforms: task.platforms,
            });
            break;
        }

        // Save results to database
        await saveComparisonResults(taskId, results, task.user_id);

        completedCount++;
      } catch (error) {
        console.error(`Error processing product ${product.identifier}:`, error);
        failedCount++;
      }

      // Update progress
      await supabase
        .from('comparison_tasks')
        .update({
          completed_products: completedCount,
          failed_products: failedCount,
        })
        .eq('id', taskId);
    }

    // Mark task as completed
    await supabase
      .from('comparison_tasks')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', taskId);
  } catch (error) {
    console.error('Error processing comparison task:', error);

    // Mark task as failed
    await supabase
      .from('comparison_tasks')
      .update({
        status: 'failed',
        error_message: (error as Error).message,
        completed_at: new Date().toISOString(),
      })
      .eq('id', taskId);

    throw error;
  }
}

/**
 * Save comparison results to database
 */
async function saveComparisonResults(
  taskId: string,
  results: ProductResult[],
  userId: string
): Promise<void> {
  for (const result of results) {
    try {
      // Create or get product
      const { data: product, error: productError } = await supabase
        .from('products')
        .upsert({
          name: result.name,
          image_url: result.imageUrl,
          original_url: result.productUrl,
          specs: result.specs || {},
          user_id: userId,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Create or get vendor
      let vendorId: string | undefined;
      if (result.vendorName) {
        const { data: vendor } = await supabase
          .from('vendors')
          .upsert({
            name: result.vendorName,
            platform: result.platform,
            user_id: userId,
          })
          .select()
          .single();

        vendorId = vendor?.id;
      }

      // Save price record
      await supabase.from('price_records').insert({
        product_id: product.id,
        vendor_id: vendorId,
        price: result.price,
        original_price: result.originalPrice,
        discount_rate: result.originalPrice
          ? ((result.originalPrice - result.price) / result.originalPrice) * 100
          : undefined,
        stock_status: result.stockStatus,
        sales_volume: result.salesVolume,
        rating: result.rating,
        review_count: result.reviewCount,
        product_url: result.productUrl,
        shipping_fee: result.shippingFee,
        platform_specific_data: result.specs || {},
      });
    } catch (error) {
      console.error('Error saving comparison result:', error);
    }
  }
}

/**
 * Get comparison task status
 */
export async function getComparisonTaskStatus(
  taskId: string
): Promise<ComparisonTask | null> {
  const { data, error } = await supabase
    .from('comparison_tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  if (error) {
    console.error('Error getting task status:', error);
    return null;
  }

  return data;
}

/**
 * Get price records for a product
 */
export async function getPriceRecordsForProduct(
  productId: string
): Promise<PriceRecord[]> {
  const { data, error } = await supabase
    .from('price_records')
    .select('*')
    .eq('product_id', productId)
    .order('scraped_at', { ascending: false });

  if (error) {
    console.error('Error getting price records:', error);
    return [];
  }

  return data || [];
}
