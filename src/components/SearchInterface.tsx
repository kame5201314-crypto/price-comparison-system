import { useState } from 'react';
import { Search, Link, Image, Loader2 } from 'lucide-react';
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

const PLATFORMS = [
  { id: 'shopee', name: '蝦皮購物' },
  { id: 'pchome', name: 'PChome 24h' },
  { id: 'momo', name: 'momo購物網' },
];

type SearchType = 'keyword' | 'url' | 'image';

interface SearchInterfaceProps {
  onSearchComplete: (results: ProductResult[], keywords?: string[]) => void;
}

export function SearchInterface({ onSearchComplete }: SearchInterfaceProps) {
  const [searchType, setSearchType] = useState<SearchType>('keyword');
  const [keyword, setKeyword] = useState('');
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['shopee', 'pchome', 'momo']);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
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
            return;
          }
          results = await searchProductByUrl({
            url: url.trim(),
            platforms: selectedPlatforms,
          });
          break;

        case 'image':
          if (!selectedFile) {
            setError('請上傳商品圖片');
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>智能商品比價搜尋</CardTitle>
        <CardDescription>
          輸入關鍵字、貼上商品網址或上傳圖片，我們將為您搜尋最優惠的價格
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Type Tabs */}
        <div className="flex space-x-2 border-b">
          <button
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              searchType === 'keyword'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSearchType('keyword')}
          >
            <Search className="inline-block w-4 h-4 mr-2" />
            關鍵字搜尋
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              searchType === 'url'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSearchType('url')}
          >
            <Link className="inline-block w-4 h-4 mr-2" />
            網址搜尋
          </button>
          <button
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              searchType === 'image'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSearchType('image')}
          >
            <Image className="inline-block w-4 h-4 mr-2" />
            圖片搜尋
          </button>
        </div>

        {/* Search Input Area */}
        <div className="space-y-4">
          {searchType === 'keyword' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商品名稱或關鍵字
              </label>
              <Input
                type="text"
                placeholder="例如：iPhone 15 Pro、Nike運動鞋"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          )}

          {searchType === 'url' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商品網址
              </label>
              <Input
                type="url"
                placeholder="貼上商品連結（支援蝦皮、PChome、momo等）"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          )}

          {searchType === 'image' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                上傳商品圖片
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                {selectedFile ? (
                  <div className="space-y-2">
                    <Image className="w-12 h-12 mx-auto text-green-600" />
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      點擊或拖曳圖片來更換
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Image className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {isDragActive
                        ? '放開滑鼠上傳圖片'
                        : '點擊或拖曳圖片到這裡'}
                    </p>
                    <p className="text-xs text-gray-500">
                      支援 PNG、JPG、JPEG、GIF、WebP
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
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
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {platform.name}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          isLoading={isSearching}
          className="w-full"
          size="lg"
        >
          {isSearching ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              搜尋中...
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
