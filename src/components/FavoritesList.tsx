import { Heart, Trash2, ExternalLink, Bell, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { FavoriteProduct } from '../App';
import { formatPrice } from '../lib/utils';

interface FavoritesListProps {
  favorites: FavoriteProduct[];
  onRemove: (id: string) => void;
  onAddAlert: (product: FavoriteProduct) => void;
}

export function FavoritesList({ favorites, onRemove, onAddAlert }: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">收藏夾是空的</h3>
          <p className="text-gray-500">搜尋商品後點擊「加入收藏」來保存喜歡的商品</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-500" />
            <span>我的收藏</span>
          </CardTitle>
          <CardDescription>
            共收藏 {favorites.length} 個商品
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {item.imageUrl && (
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-40 object-cover"
                    />
                    <span className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                      {item.platform}
                    </span>
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                    {item.name}
                  </h3>

                  <div className="flex items-baseline space-x-2 mb-3">
                    <span className="text-2xl font-bold text-red-600">
                      {formatPrice(item.lowestPrice)}
                    </span>
                  </div>

                  {item.priceHistory && item.priceHistory.length > 1 && (
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      <span>
                        歷史價格: {formatPrice(Math.min(...item.priceHistory.map(p => p.price)))} -
                        {formatPrice(Math.max(...item.priceHistory.map(p => p.price)))}
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mb-3">
                    收藏於 {new Date(item.savedAt).toLocaleDateString('zh-TW')}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(item.productUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      前往購買
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddAlert(item)}
                      title="設定降價提醒"
                    >
                      <Bell className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRemove(item.id)}
                      className="text-red-600 hover:bg-red-50"
                      title="移除收藏"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
