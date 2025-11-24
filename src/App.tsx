import { useState } from 'react';
import { Search, Package, Store, ShoppingBag, AlertCircle } from 'lucide-react';
import { SearchInterface } from './components/SearchInterface';
import { ComparisonResults } from './components/ComparisonResults';
import { ProductResult } from './services/crawlers';
import { isSupabaseConfigured } from './lib/supabase';

function App() {
  const [searchResults, setSearchResults] = useState<ProductResult[]>([]);
  const [searchKeywords, setSearchKeywords] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const isConfigured = isSupabaseConfigured();

  const handleSearchComplete = (results: ProductResult[], keywords?: string[]) => {
    setSearchResults(results);
    setSearchKeywords(keywords || []);
    setShowResults(true);
  };

  const handleNewSearch = () => {
    setShowResults(false);
    setSearchResults([]);
    setSearchKeywords([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  智能商品比價系統
                </h1>
                <p className="text-sm text-gray-500">
                  Smart Price Comparison System
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <button
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={handleNewSearch}
              >
                <Search className="w-5 h-5" />
                <span>搜尋比價</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                <Store className="w-5 h-5" />
                <span>廠商管理</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                <ShoppingBag className="w-5 h-5" />
                <span>訂單追蹤</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Configuration Warning */}
        {!isConfigured && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                  ⚙️ 系統配置提醒
                </h3>
                <p className="text-sm text-yellow-700 mb-2">
                  Supabase 環境變數尚未配置，數據庫功能將無法使用。搜尋功能仍可正常使用。
                </p>
                <p className="text-xs text-yellow-600">
                  請在 Vercel Dashboard 的 Settings → Environment Variables 中添加：
                  <code className="ml-1 bg-yellow-100 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> 和
                  <code className="ml-1 bg-yellow-100 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {!showResults ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                找到最優惠的商品價格
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                支持關鍵字、網址、圖片搜尋，一鍵比價多個平台
              </p>
            </div>

            {/* Search Interface */}
            <SearchInterface onSearchComplete={handleSearchComplete} />

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 bg-white rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">多方式搜尋</h3>
                <p className="text-gray-600 text-sm">
                  支持關鍵字、商品網址和圖片三種搜尋方式，滿足不同需求
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">批量比價</h3>
                <p className="text-gray-600 text-sm">
                  一次比較多個商品，最多支持100個商品同時比價
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Store className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">廠商管理</h3>
                <p className="text-gray-600 text-sm">
                  記錄優質廠商資訊，方便後續聯絡與訂購追蹤
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={handleNewSearch}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Search className="w-5 h-5" />
              <span>重新搜尋</span>
            </button>

            {/* Results */}
            <ComparisonResults
              results={searchResults}
              keywords={searchKeywords}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-600">
                © 2025 智能商品比價系統 - Smart Price Comparison
              </p>
              <p className="text-sm text-gray-500 mt-1">
                支持蝦皮、PChome、momo等多個電商平台
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Built with ❤️ using React + TypeScript</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
