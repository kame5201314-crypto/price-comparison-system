import { useState } from 'react';
import { Package, Loader2, Plus, Trash2, Search, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { searchProductByKeyword } from '../services/comparisonService';
import { ProductResult } from '../services/crawlers';

const PLATFORMS = [
  { id: 'shopee', name: '蝦皮購物', icon: '🛍️' },
  { id: 'pchome', name: 'PChome 24h', icon: '📦' },
  { id: 'momo', name: 'momo購物網', icon: '🛒' },
  { id: '1688', name: '1688（阿里巴巴）', icon: '🏭' },
];

interface BatchItem {
  id: string;
  keyword: string;
  status: 'pending' | 'searching' | 'completed' | 'error';
  results?: ProductResult[];
  error?: string;
}

interface BatchComparisonProps {
  onSearchComplete: (results: ProductResult[], keywords?: string[]) => void;
}

export function BatchComparison({ onSearchComplete }: BatchComparisonProps) {
  const [batchItems, setBatchItems] = useState<BatchItem[]>([
    { id: '1', keyword: '', status: 'pending' },
  ]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['shopee', 'pchome', 'momo', '1688']);
  const [isSearching, setIsSearching] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [allResults, setAllResults] = useState<ProductResult[]>([]);

  const addItem = () => {
    if (batchItems.length >= 100) {
      alert('最多只能添加100個商品');
      return;
    }
    setBatchItems([
      ...batchItems,
      { id: Date.now().toString(), keyword: '', status: 'pending' },
    ]);
  };

  const removeItem = (id: string) => {
    if (batchItems.length <= 1) return;
    setBatchItems(batchItems.filter(item => item.id !== id));
  };

  const updateKeyword = (id: string, keyword: string) => {
    setBatchItems(batchItems.map(item =>
      item.id === id ? { ...item, keyword } : item
    ));
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleBatchSearch = async () => {
    const validItems = batchItems.filter(item => item.keyword.trim());
    if (validItems.length === 0) {
      alert('請至少輸入一個商品關鍵字');
      return;
    }

    if (selectedPlatforms.length === 0) {
      alert('請至少選擇一個平台');
      return;
    }

    setIsSearching(true);
    setCompletedCount(0);
    setAllResults([]);

    const results: ProductResult[] = [];
    const keywords: string[] = [];

    // Reset all items to pending
    setBatchItems(batchItems.map(item => ({
      ...item,
      status: item.keyword.trim() ? 'pending' : 'pending',
      results: undefined,
      error: undefined,
    })));

    for (let i = 0; i < validItems.length; i++) {
      const item = validItems[i];

      // Update status to searching
      setBatchItems(prev => prev.map(prevItem =>
        prevItem.id === item.id ? { ...prevItem, status: 'searching' } : prevItem
      ));

      try {
        const searchResults = await searchProductByKeyword({
          keyword: item.keyword.trim(),
          platforms: selectedPlatforms,
        });

        results.push(...searchResults);
        keywords.push(item.keyword.trim());

        // Update status to completed
        setBatchItems(prev => prev.map(prevItem =>
          prevItem.id === item.id
            ? { ...prevItem, status: 'completed', results: searchResults }
            : prevItem
        ));
      } catch (error) {
        // Update status to error
        setBatchItems(prev => prev.map(prevItem =>
          prevItem.id === item.id
            ? { ...prevItem, status: 'error', error: (error as Error).message }
            : prevItem
        ));
      }

      setCompletedCount(i + 1);
      setAllResults([...results]);

      // Add small delay between requests
      if (i < validItems.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    setIsSearching(false);

    if (results.length > 0) {
      onSearchComplete(results, keywords);
    }
  };

  const handlePasteMultiple = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const lines = pastedText.split('\n').filter(line => line.trim());

    if (lines.length > 0) {
      const newItems: BatchItem[] = lines.slice(0, 100).map((line, index) => ({
        id: `${Date.now()}-${index}`,
        keyword: line.trim(),
        status: 'pending' as const,
      }));
      setBatchItems(newItems);
    }
  };

  const validItemCount = batchItems.filter(item => item.keyword.trim()).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-6 h-6 text-green-600" />
            <span>批量商品比價</span>
          </CardTitle>
          <CardDescription>
            一次輸入多個商品名稱，同時搜尋比較價格（最多100個）
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              快速輸入（可貼上多行商品名稱）
            </label>
            <textarea
              className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="每行一個商品名稱，例如：&#10;iPhone 15&#10;AirPods Pro&#10;MacBook Air"
              onPaste={handlePasteMultiple}
              onChange={(e) => {
                const lines = e.target.value.split('\n').filter(line => line.trim());
                if (lines.length > 0) {
                  const newItems: BatchItem[] = lines.slice(0, 100).map((line, index) => ({
                    id: `${Date.now()}-${index}`,
                    keyword: line.trim(),
                    status: 'pending' as const,
                  }));
                  setBatchItems(newItems);
                }
              }}
            />
          </div>

          {/* Item List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                商品列表 ({validItemCount}/{batchItems.length})
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={addItem}
                disabled={batchItems.length >= 100}
              >
                <Plus className="w-4 h-4 mr-1" />
                添加商品
              </Button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 border rounded-lg p-3">
              {batchItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-8">{index + 1}.</span>
                  <Input
                    value={item.keyword}
                    onChange={(e) => updateKeyword(item.id, e.target.value)}
                    placeholder="輸入商品名稱"
                    className="flex-1"
                    disabled={isSearching}
                  />
                  {item.status === 'searching' && (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  )}
                  {item.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {item.status === 'error' && (
                    <span title={item.error}>
                      <XCircle className="w-5 h-5 text-red-500" />
                    </span>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    disabled={batchItems.length <= 1 || isSearching}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              選擇搜尋平台
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  disabled={isSearching}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  } ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="mr-2">{platform.icon}</span>
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          {/* Progress */}
          {isSearching && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">
                  搜尋進度
                </span>
                <span className="text-sm text-blue-600">
                  {completedCount} / {validItemCount}
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedCount / validItemCount) * 100}%` }}
                />
              </div>
              <p className="text-xs text-blue-600 mt-2">
                已找到 {allResults.length} 個商品
              </p>
            </div>
          )}

          {/* Search Button */}
          <Button
            onClick={handleBatchSearch}
            disabled={isSearching || validItemCount === 0}
            isLoading={isSearching}
            className="w-full"
            size="lg"
          >
            {isSearching ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                搜尋中 ({completedCount}/{validItemCount})...
              </>
            ) : (
              <>
                <Search className="mr-2" />
                開始批量比價 ({validItemCount} 個商品)
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardContent className="py-4">
          <h4 className="font-medium text-gray-800 mb-2">使用提示</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 可直接從 Excel 或文本文件複製商品列表貼上</li>
            <li>• 每行一個商品名稱，系統會自動識別</li>
            <li>• 建議使用精確的商品名稱以獲得更好的比價結果</li>
            <li>• 最多支持同時比較 100 個商品</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
