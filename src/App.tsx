import { useState, useEffect } from 'react';
import { Search, Package, Store, Heart, History, TrendingDown, Bell } from 'lucide-react';
import { SearchInterface } from './components/SearchInterface';
import { ComparisonResults } from './components/ComparisonResults';
import { BatchComparison } from './components/BatchComparison';
import { VendorManagement } from './components/VendorManagement';
import { FavoritesList } from './components/FavoritesList';
import { SearchHistory } from './components/SearchHistory';
import { PriceAlerts } from './components/PriceAlerts';
import { ProductResult } from './services/crawlers';

type Page = 'home' | 'batch' | 'vendors' | 'results' | 'favorites' | 'history' | 'alerts';

// Storage keys
const FAVORITES_KEY = 'price-comparison-favorites';
const HISTORY_KEY = 'price-comparison-history';
const ALERTS_KEY = 'price-comparison-alerts';

export interface FavoriteProduct {
  id: string;
  name: string;
  imageUrl?: string;
  lowestPrice: number;
  platform: string;
  productUrl: string;
  savedAt: string;
  lastCheckedPrice?: number;
  priceHistory: { price: number; date: string }[];
}

export interface SearchHistoryItem {
  id: string;
  keyword: string;
  searchType: 'keyword' | 'url' | 'image';
  resultCount: number;
  lowestPrice?: number;
  searchedAt: string;
}

export interface PriceAlert {
  id: string;
  productName: string;
  productUrl: string;
  targetPrice: number;
  currentPrice: number;
  platform: string;
  imageUrl?: string;
  createdAt: string;
  triggered: boolean;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [searchResults, setSearchResults] = useState<ProductResult[]>([]);
  const [searchKeywords, setSearchKeywords] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    const savedAlerts = localStorage.getItem(ALERTS_KEY);

    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
    if (savedAlerts) setPriceAlerts(JSON.parse(savedAlerts));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  const handleSearchComplete = (results: ProductResult[], keywords?: string[]) => {
    setSearchResults(results);
    setSearchKeywords(keywords || []);
    setCurrentPage('results');

    // Add to search history
    if (keywords && keywords.length > 0) {
      const lowestPrice = results.length > 0 ? Math.min(...results.map(r => r.price)) : undefined;
      const historyItem: SearchHistoryItem = {
        id: Date.now().toString(),
        keyword: keywords[0],
        searchType: 'keyword',
        resultCount: results.length,
        lowestPrice,
        searchedAt: new Date().toISOString(),
      };
      setSearchHistory(prev => [historyItem, ...prev.slice(0, 49)]); // Keep last 50
    }
  };

  const handleNewSearch = () => {
    setCurrentPage('home');
    setSearchResults([]);
    setSearchKeywords([]);
  };

  const handleAddToFavorites = (product: ProductResult) => {
    const existing = favorites.find(f => f.productUrl === product.productUrl);
    if (existing) {
      alert('此商品已在收藏夾中');
      return;
    }

    const favorite: FavoriteProduct = {
      id: Date.now().toString(),
      name: product.name,
      imageUrl: product.imageUrl,
      lowestPrice: product.price,
      platform: product.platform,
      productUrl: product.productUrl,
      savedAt: new Date().toISOString(),
      lastCheckedPrice: product.price,
      priceHistory: [{ price: product.price, date: new Date().toISOString() }],
    };

    setFavorites(prev => [favorite, ...prev]);
    alert('已加入收藏！');
  };

  const handleRemoveFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const handleAddPriceAlert = (product: ProductResult, targetPrice: number) => {
    const alert: PriceAlert = {
      id: Date.now().toString(),
      productName: product.name,
      productUrl: product.productUrl,
      targetPrice,
      currentPrice: product.price,
      platform: product.platform,
      imageUrl: product.imageUrl,
      createdAt: new Date().toISOString(),
      triggered: false,
    };

    setPriceAlerts(prev => [alert, ...prev]);
  };

  const handleRemoveAlert = (id: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== id));
  };

  const navItems = [
    { id: 'home' as Page, label: '搜尋比價', icon: Search },
    { id: 'batch' as Page, label: '批量比價', icon: Package },
    { id: 'favorites' as Page, label: '收藏夾', icon: Heart, badge: favorites.length },
    { id: 'alerts' as Page, label: '降價提醒', icon: Bell, badge: priceAlerts.filter(a => !a.triggered).length },
    { id: 'history' as Page, label: '搜尋記錄', icon: History },
    { id: 'vendors' as Page, label: '廠商管理', icon: Store },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setCurrentPage('home')}
            >
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">
                  智能比價系統
                </h1>
                <p className="text-xs text-gray-500">
                  找到最優惠的價格
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id ||
                  (item.id === 'home' && currentPage === 'results');
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`relative flex items-center space-x-1 px-3 py-2 rounded-lg transition-all text-sm ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Home Page */}
        {currentPage === 'home' && (
          <div className="space-y-6">
            <SearchInterface
              onSearchComplete={handleSearchComplete}
              recentSearches={searchHistory.slice(0, 5)}
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                className="bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setCurrentPage('favorites')}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Heart className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                    <p className="text-xs text-gray-500">收藏商品</p>
                  </div>
                </div>
              </div>

              <div
                className="bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setCurrentPage('alerts')}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Bell className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{priceAlerts.length}</p>
                    <p className="text-xs text-gray-500">降價提醒</p>
                  </div>
                </div>
              </div>

              <div
                className="bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setCurrentPage('history')}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <History className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{searchHistory.length}</p>
                    <p className="text-xs text-gray-500">搜尋記錄</p>
                  </div>
                </div>
              </div>

              <div
                className="bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setCurrentPage('vendors')}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Store className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {JSON.parse(localStorage.getItem('price-comparison-vendors') || '[]').length}
                    </p>
                    <p className="text-xs text-gray-500">廠商資料</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Favorites */}
            {favorites.length > 0 && (
              <div className="bg-white rounded-lg border shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">最近收藏</h3>
                  <button
                    onClick={() => setCurrentPage('favorites')}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    查看全部
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {favorites.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => window.open(item.productUrl, '_blank')}
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                      )}
                      <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                      <p className="text-red-600 font-bold">NT${item.lowestPrice}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search Results Page */}
        {currentPage === 'results' && (
          <div className="space-y-6">
            <button
              onClick={handleNewSearch}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Search className="w-5 h-5" />
              <span>重新搜尋</span>
            </button>
            <ComparisonResults
              results={searchResults}
              keywords={searchKeywords}
              onAddToFavorites={handleAddToFavorites}
              onAddPriceAlert={handleAddPriceAlert}
            />
          </div>
        )}

        {/* Batch Comparison Page */}
        {currentPage === 'batch' && (
          <BatchComparison onSearchComplete={handleSearchComplete} />
        )}

        {/* Favorites Page */}
        {currentPage === 'favorites' && (
          <FavoritesList
            favorites={favorites}
            onRemove={handleRemoveFromFavorites}
            onAddAlert={(product) => {
              const targetPrice = Math.floor(product.lowestPrice * 0.9);
              handleAddPriceAlert({
                name: product.name,
                price: product.lowestPrice,
                productUrl: product.productUrl,
                platform: product.platform,
                imageUrl: product.imageUrl,
              } as ProductResult, targetPrice);
            }}
          />
        )}

        {/* Price Alerts Page */}
        {currentPage === 'alerts' && (
          <PriceAlerts
            alerts={priceAlerts}
            onRemove={handleRemoveAlert}
          />
        )}

        {/* Search History Page */}
        {currentPage === 'history' && (
          <SearchHistory
            history={searchHistory}
            onSearch={(keyword) => {
              setCurrentPage('home');
            }}
            onClear={() => setSearchHistory([])}
          />
        )}

        {/* Vendor Management Page */}
        {currentPage === 'vendors' && (
          <VendorManagement />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 智能商品比價系統</p>
            <p className="mt-1">支持蝦皮、PChome、momo、1688 等多個電商平台</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
