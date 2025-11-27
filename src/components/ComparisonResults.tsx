import { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  ExternalLink,
  Star,
  TrendingDown,
  ShoppingCart,
  Heart,
  Bell,
  Filter,
  Grid,
  List,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { ProductResult } from '../services/crawlers';
import { formatPrice, formatNumber, calculateDiscount } from '../lib/utils';

interface ComparisonResultsProps {
  results: ProductResult[];
  keywords?: string[];
  onAddToFavorites?: (product: ProductResult) => void;
  onAddPriceAlert?: (product: ProductResult, targetPrice: number) => void;
}

type SortBy = 'price' | 'sales' | 'rating' | 'discount';
type ViewMode = 'grid' | 'list';

export function ComparisonResults({
  results,
  keywords,
  onAddToFavorites,
  onAddPriceAlert,
}: ComparisonResultsProps) {
  const [sortBy, setSortBy] = useState<SortBy>('price');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [priceAlertProduct, setPriceAlertProduct] = useState<ProductResult | null>(null);
  const [targetPrice, setTargetPrice] = useState<string>('');

  const platforms = useMemo(() => {
    const platformSet = new Set(results.map(r => r.platform));
    return Array.from(platformSet);
  }, [results]);

  const filteredAndSortedResults = useMemo(() => {
    let filtered = results;

    if (filterPlatform !== 'all') {
      filtered = results.filter(r => r.platform === filterPlatform);
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'sales':
          return (b.salesVolume || 0) - (a.salesVolume || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'discount':
          const discountA = a.originalPrice ? calculateDiscount(a.originalPrice, a.price) : 0;
          const discountB = b.originalPrice ? calculateDiscount(b.originalPrice, b.price) : 0;
          return discountB - discountA;
        default:
          return 0;
      }
    });
  }, [results, sortBy, filterPlatform]);

  const lowestPrice = useMemo(() => {
    return Math.min(...results.map(r => r.price));
  }, [results]);

  const highestSales = useMemo(() => {
    return Math.max(...results.map(r => r.salesVolume || 0));
  }, [results]);

  const handleAddAlert = () => {
    if (priceAlertProduct && targetPrice && onAddPriceAlert) {
      onAddPriceAlert(priceAlertProduct, parseInt(targetPrice));
      setPriceAlertProduct(null);
      setTargetPrice('');
      alert('降價提醒已設定！');
    }
  };

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
    <div className="w-full space-y-4">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl">
          <p className="text-green-100 text-sm">最低價格</p>
          <p className="text-2xl font-bold">{formatPrice(lowestPrice)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl">
          <p className="text-blue-100 text-sm">找到商品</p>
          <p className="text-2xl font-bold">{results.length} 個</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl">
          <p className="text-purple-100 text-sm">搜尋平台</p>
          <p className="text-2xl font-bold">{platforms.length} 個</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl">
          <p className="text-orange-100 text-sm">最高銷量</p>
          <p className="text-2xl font-bold">{formatNumber(highestSales)}</p>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">排序:</span>
              <div className="flex gap-1">
                {[
                  { id: 'price', label: '價格' },
                  { id: 'sales', label: '銷量' },
                  { id: 'rating', label: '評分' },
                  { id: 'discount', label: '折扣' },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id as SortBy)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      sortBy === option.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter & View */}
            <div className="flex items-center gap-3">
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="text-sm border rounded-lg px-3 py-1.5"
              >
                <option value="all">所有平台</option>
                {platforms.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              <div className="flex border rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
        {filteredAndSortedResults.map((product, index) => {
          const discount = product.originalPrice
            ? calculateDiscount(product.originalPrice, product.price)
            : 0;
          const isLowest = product.price === lowestPrice;
          const isBestSeller = product.salesVolume === highestSales && highestSales > 0;

          if (viewMode === 'grid') {
            return (
              <div
                key={`${product.platform}-${index}`}
                className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {product.imageUrl && (
                  <div className="relative">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-40 object-cover"
                    />
                    {isLowest && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                        最低價
                      </span>
                    )}
                    <span className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                      {product.platform}
                    </span>
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xl font-bold text-red-600">{formatPrice(product.price)}</span>
                    {discount > 0 && (
                      <span className="text-xs text-red-500 bg-red-50 px-1 rounded">-{discount}%</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => window.open(product.productUrl, '_blank')}
                    >
                      購買
                    </Button>
                    {onAddToFavorites && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAddToFavorites(product)}
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={`${product.platform}-${index}`}
              className={`bg-white border rounded-xl p-4 hover:shadow-lg transition-shadow ${
                isLowest ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <div className="flex gap-4">
                {product.imageUrl && (
                  <div className="relative flex-shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-28 h-28 object-cover rounded-lg"
                    />
                    {isLowest && (
                      <span className="absolute -top-2 -left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded shadow">
                        最低價
                      </span>
                    )}
                  </div>
                )}

                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                    <span className="flex-shrink-0 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {product.platform}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-red-600">{formatPrice(product.price)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                          -{discount}%
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                    {product.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {product.rating.toFixed(1)}
                        {product.reviewCount && (
                          <span className="text-gray-400">({formatNumber(product.reviewCount)})</span>
                        )}
                      </span>
                    )}
                    {product.salesVolume !== undefined && product.salesVolume > 0 && (
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="w-4 h-4" />
                        已售 {formatNumber(product.salesVolume)}
                        {isBestSeller && (
                          <span className="text-orange-600 text-xs font-medium">熱銷</span>
                        )}
                      </span>
                    )}
                    {product.shippingFee !== undefined && (
                      <span>
                        {product.shippingFee === 0 ? (
                          <span className="text-green-600">免運</span>
                        ) : (
                          `運費 ${formatPrice(product.shippingFee)}`
                        )}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => window.open(product.productUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      前往購買
                    </Button>
                    {onAddToFavorites && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddToFavorites(product)}
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        收藏
                      </Button>
                    )}
                    {onAddPriceAlert && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPriceAlertProduct(product);
                          setTargetPrice(Math.floor(product.price * 0.9).toString());
                        }}
                      >
                        <Bell className="w-4 h-4 mr-1" />
                        提醒
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Alert Modal */}
      {priceAlertProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">設定降價提醒</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{priceAlertProduct.name}</p>
            <p className="text-gray-500 mb-4">目前價格: {formatPrice(priceAlertProduct.price)}</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目標價格 (低於此價格時提醒)
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="輸入目標價格"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPriceAlertProduct(null)}
              >
                取消
              </Button>
              <Button className="flex-1" onClick={handleAddAlert}>
                設定提醒
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
