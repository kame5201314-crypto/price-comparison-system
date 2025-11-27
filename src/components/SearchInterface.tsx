import { useState } from 'react';
import { Search, Link, Image, Loader2, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useDropzone } from 'react-dropzone';
import {
  searchProductByKeyword,
  searchProductByUrl,
  searchProductByImage,
} from '../services/comparisonService';
import { ProductResult } from '../services/crawlers';
import { SearchHistoryItem } from '../App';

const PLATFORMS = [
  { id: 'shopee', name: '蝦皮購物', icon: '🛍️', color: 'orange' },
  { id: 'pchome', name: 'PChome', icon: '📦', color: 'red' },
  { id: 'momo', name: 'momo', icon: '🛒', color: 'pink' },
  { id: '1688', name: '1688', icon: '🏭', color: 'yellow' },
];

type SearchType = 'keyword' | 'url' | 'image';

interface SearchInterfaceProps {
  onSearchComplete: (results: ProductResult[], keywords?: string[]) => void;
  recentSearches?: SearchHistoryItem[];
}

export function SearchInterface({ onSearchComplete, recentSearches = [] }: SearchInterfaceProps) {
  const [searchType, setSearchType] = useState<SearchType>('keyword');
  const [keyword, setKeyword] = useState('');
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['shopee', 'pchome', 'momo', '1688']);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError('');
      }
    },
  });

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const selectAllPlatforms = () => {
    setSelectedPlatforms(PLATFORMS.map(p => p.id));
  };

  const handleSearch = async () => {
    if (selectedPlatforms.length === 0) {
      setError('請至少選擇一個平台');
      return;
    }

    setError('');
    setIsSearching(true);

    try {
      let results: ProductResult[] = [];
      let keywords: string[] = [];

      switch (searchType) {
        case 'keyword':
          if (!keyword.trim()) {
            setError('請輸入搜尋關鍵字');
            setIsSearching(false);
            return;
          }
          results = await searchProductByKeyword({
            keyword: keyword.trim(),
            platforms: selectedPlatforms,
          });
          keywords = [keyword.trim()];
          break;

        case 'url':
          if (!url.trim()) {
            setError('請輸入商品網址');
            setIsSearching(false);
            return;
          }
          // Extract product name from URL for comparison
          results = await searchProductByUrl({
            url: url.trim(),
            platforms: selectedPlatforms,
          });
          keywords = ['網址搜尋'];
          break;

        case 'image':
          if (!selectedFile) {
            setError('請上傳商品圖片');
            setIsSearching(false);
            return;
          }
          const imageResult = await searchProductByImage({
            imageFile: selectedFile,
            platforms: selectedPlatforms,
          });
          results = imageResult.results;
          keywords = imageResult.keywords;
          break;
      }

      onSearchComplete(results, keywords);
    } catch (err) {
      setError((err as Error).message || '搜尋失敗，請稍後再試');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSearch = (searchKeyword: string) => {
    setKeyword(searchKeyword);
    setSearchType('keyword');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <span>智能商品比價</span>
        </CardTitle>
        <CardDescription>
          輸入商品名稱、貼上網址或上傳圖片，立即比較各平台價格
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Search Type Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md font-medium transition-all ${
              searchType === 'keyword'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setSearchType('keyword')}
          >
            <Search className="w-4 h-4" />
            <span>關鍵字</span>
          </button>
          <button
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md font-medium transition-all ${
              searchType === 'url'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setSearchType('url')}
          >
            <Link className="w-4 h-4" />
            <span>網址比價</span>
          </button>
          <button
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md font-medium transition-all ${
              searchType === 'image'
                ? 'bg-white shadow text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setSearchType('image')}
          >
            <Image className="w-4 h-4" />
            <span>圖片搜尋</span>
          </button>
        </div>

        {/* Search Input Area */}
        <div>
          {searchType === 'keyword' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="輸入商品名稱，例如：iPhone 15、AirPods Pro"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && !keyword && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    最近搜尋:
                  </span>
                  {recentSearches.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleQuickSearch(item.keyword)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                    >
                      {item.keyword}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {searchType === 'url' && (
            <div className="space-y-3">
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  placeholder="貼上商品網址 (蝦皮、PChome、momo、淘寶等)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="text-sm text-gray-500">
                貼上商品連結，系統會自動識別商品並搜尋其他平台的相同或類似商品
              </p>
            </div>
          )}

          {searchType === 'image' && (
            <div>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                {previewUrl ? (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-gray-600">{selectedFile?.name}</p>
                    <p className="text-xs text-gray-500">點擊或拖曳來更換圖片</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Image className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="text-gray-600">
                      {isDragActive ? '放開滑鼠上傳' : '點擊或拖曳圖片到這裡'}
                    </p>
                    <p className="text-xs text-gray-500">
                      支援 PNG、JPG、JPEG、GIF、WebP 格式
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Platform Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              選擇比價平台
            </label>
            <button
              onClick={selectAllPlatforms}
              className="text-xs text-blue-600 hover:underline"
            >
              全選
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <span>{platform.icon}</span>
                <span>{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full py-3 text-lg"
          size="lg"
        >
          {isSearching ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              正在搜尋 {selectedPlatforms.length} 個平台...
            </>
          ) : (
            <>
              <Search className="mr-2" />
              開始比價
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
