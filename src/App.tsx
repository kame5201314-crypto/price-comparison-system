import { useState } from 'react';
import { Search, Package, Store, ShoppingBag, AlertCircle, Home } from 'lucide-react';
import { SearchInterface } from './components/SearchInterface';
import { ComparisonResults } from './components/ComparisonResults';
import { BatchComparison } from './components/BatchComparison';
import { VendorManagement } from './components/VendorManagement';
import { ProductResult } from './services/crawlers';
import { isSupabaseConfigured } from './lib/supabase';

type Page = 'home' | 'search' | 'batch' | 'vendors' | 'results';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [searchResults, setSearchResults] = useState<ProductResult[]>([]);
  const [searchKeywords, setSearchKeywords] = useState<string[]>([]);
  const isConfigured = isSupabaseConfigured();

  const handleSearchComplete = (results: ProductResult[], keywords?: string[]) => {
    setSearchResults(results);
    setSearchKeywords(keywords || []);
    setCurrentPage('results');
  };

  const handleNewSearch = () => {
    setCurrentPage('home');
    setSearchResults([]);
    setSearchKeywords([]);
  };

  const navItems = [
    { id: 'home' as Page, label: '首頁', icon: Home },
    { id: 'batch' as Page, label: '批量比價', icon: Package },
    { id: 'vendors' as Page, label: '廠商管理', icon: Store },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setCurrentPage('home')}
            >
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
            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id ||
                  (item.id === 'home' && (currentPage === 'search' || currentPage === 'results'));
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile menu */}
            <div className="flex md:hidden space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
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
                  系統配置提醒
                </h3>
                <p className="text-sm text-yellow-700">
                  部分功能使用本地存儲，數據僅保存在您的瀏覽器中。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Home Page */}
        {currentPage === 'home' && (
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

            {/* Features - Now Clickable */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div
                className="p-6 bg-white rounded-lg shadow-sm border cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
                onClick={() => setCurrentPage('home')}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">多方式搜尋</h3>
                <p className="text-gray-600 text-sm">
                  支持關鍵字、商品網址和圖片三種搜尋方式，滿足不同需求
                </p>
              </div>

              <div
                className="p-6 bg-white rounded-lg shadow-sm border cursor-pointer hover:shadow-md hover:border-green-300 transition-all"
                onClick={() => setCurrentPage('batch')}
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">批量比價</h3>
                <p className="text-gray-600 text-sm">
                  一次比較多個商品，最多支持100個商品同時比價
                </p>
                <span className="inline-block mt-2 text-green-600 text-sm font-medium">
                  點擊使用 →
                </span>
              </div>

              <div
                className="p-6 bg-white rounded-lg shadow-sm border cursor-pointer hover:shadow-md hover:border-purple-300 transition-all"
                onClick={() => setCurrentPage('vendors')}
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Store className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">廠商管理</h3>
                <p className="text-gray-600 text-sm">
                  記錄優質廠商資訊，方便後續聯絡與訂購追蹤
                </p>
                <span className="inline-block mt-2 text-purple-600 text-sm font-medium">
                  點擊使用 →
                </span>
              </div>
            </div>
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
            />
          </div>
        )}

        {/* Batch Comparison Page */}
        {currentPage === 'batch' && (
          <BatchComparison onSearchComplete={handleSearchComplete} />
        )}

        {/* Vendor Management Page */}
        {currentPage === 'vendors' && (
          <VendorManagement />
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
                支持蝦皮、PChome、momo、1688（阿里巴巴）等多個電商平台
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Built with React + TypeScript</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
