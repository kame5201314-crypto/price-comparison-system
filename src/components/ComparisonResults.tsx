import { useState, useMemo } from 'react';
import { ArrowUpDown, ExternalLink, Star, TrendingDown, ShoppingCart, Bookmark } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { ProductResult } from '../services/crawlers';
import { formatPrice, formatNumber, calculateDiscount } from '../lib/utils';

interface ComparisonResultsProps {
  results: ProductResult[];
  keywords?: string[];
}

type SortBy = 'price' | 'sales' | 'rating' | 'discount';

export function ComparisonResults({ results, keywords }: ComparisonResultsProps) {
  const [sortBy, setSortBy] = useState<SortBy>('price');

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'sales':
          return (b.salesVolume || 0) - (a.salesVolume || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'discount':
          const discountA = a.originalPrice
            ? calculateDiscount(a.originalPrice, a.price)
            : 0;
          const discountB = b.originalPrice
            ? calculateDiscount(b.originalPrice, b.price)
            : 0;
          return discountB - discountA;
        default:
          return 0;
      }
    });
  }, [results, sortBy]);

  const lowestPrice = useMemo(() => {
    return Math.min(...results.map(r => r.price));
  }, [results]);

  const highestSales = useMemo(() => {
    return Math.max(...results.map(r => r.salesVolume || 0));
  }, [results]);

  if (results.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">沒有找到符合的商品，請嘗試其他關鍵字</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Stats */}
      <Card>
        <CardHeader>
          <CardTitle>比價結果</CardTitle>
          <CardDescription>
            {keywords && keywords.length > 0 && (
              <span>搜尋關鍵字: {keywords.join(', ')} • </span>
            )}
            找到 {results.length} 個商品
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 font-medium">最低價格</p>
              <p className="text-2xl font-bold text-green-900">
                {formatPrice(lowestPrice)}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">最高銷量</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatNumber(highestSales)}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700 font-medium">平台數量</p>
              <p className="text-2xl font-bold text-purple-900">
                {new Set(results.map(r => r.platform)).size}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sort Controls */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 self-center">排序：</span>
            <Button
              variant={sortBy === 'price' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('price')}
            >
              <ArrowUpDown className="w-4 h-4 mr-1" />
              價格
            </Button>
            <Button
              variant={sortBy === 'sales' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('sales')}
            >
              <TrendingDown className="w-4 h-4 mr-1" />
              銷量
            </Button>
            <Button
              variant={sortBy === 'rating' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('rating')}
            >
              <Star className="w-4 h-4 mr-1" />
              評分
            </Button>
            <Button
              variant={sortBy === 'discount' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('discount')}
            >
              <TrendingDown className="w-4 h-4 mr-1" />
              折扣
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results List */}
      <div className="space-y-4">
        {sortedResults.map((product, index) => {
          const discount = product.originalPrice
            ? calculateDiscount(product.originalPrice, product.price)
            : 0;

          return (
            <Card key={`${product.platform}-${index}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  {product.imageUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>
                      <span className="ml-2 flex-shrink-0 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {product.platform}
                      </span>
                    </div>

                    {/* Price Info */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-3xl font-bold text-red-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <>
                          <span className="text-lg text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-bold rounded">
                            -{discount}%
                          </span>
                        </>
                      )}
                      {product.price === lowestPrice && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-bold rounded">
                          最低價
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{product.rating.toFixed(1)}</span>
                          {product.reviewCount && (
                            <span className="text-gray-400">
                              ({formatNumber(product.reviewCount)})
                            </span>
                          )}
                        </div>
                      )}
                      {product.salesVolume !== undefined && product.salesVolume > 0 && (
                        <div className="flex items-center gap-1">
                          <ShoppingCart className="w-4 h-4" />
                          <span>已售 {formatNumber(product.salesVolume)}</span>
                          {product.salesVolume === highestSales && (
                            <span className="text-xs text-blue-600 font-medium">熱銷</span>
                          )}
                        </div>
                      )}
                      {product.shippingFee !== undefined && (
                        <div>
                          運費: {product.shippingFee === 0 ? (
                            <span className="text-green-600 font-medium">免運</span>
                          ) : (
                            formatPrice(product.shippingFee)
                          )}
                        </div>
                      )}
                      {product.stockStatus && (
                        <div>
                          {product.stockStatus === 'available' ? (
                            <span className="text-green-600">有貨</span>
                          ) : (
                            <span className="text-red-600">缺貨</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => window.open(product.productUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        前往購買
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Add to favorites
                          console.log('Add to favorites:', product);
                        }}
                      >
                        <Bookmark className="w-4 h-4 mr-1" />
                        加入收藏
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
