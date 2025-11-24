import { useState } from 'react';
import { ShoppingBag, Download, Loader2, Wand2 } from 'lucide-react';
import { ProductInfo, Platform, PlatformContent, GeneratedCopy, CopywritingType } from '../../types/marketing';
import { PlatformConversionService, CopywritingService } from '../../services/aiMarketingService';

export default function PlatformConverter() {
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    name: '',
    url: '',
    description: '',
    price: 0
  });

  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(Platform.SHOPEE);
  const [convertedContent, setConvertedContent] = useState<PlatformContent | null>(null);
  const [loading, setLoading] = useState(false);

  // 轉換為平台格式
  const handleConvert = async () => {
    // 如果有網址但沒有商品名稱，先分析網址
    if (productInfo.url && !productInfo.name) {
      setLoading(true);
      try {
        const analyzedInfo = await CopywritingService.analyzeProductUrl(productInfo.url);
        const mergedInfo = { ...productInfo, ...analyzedInfo };
        setProductInfo(mergedInfo);

        // 分析完成後繼續轉換
        const copy = await CopywritingService.generateCopy(mergedInfo, CopywritingType.ECOMMERCE);
        const converted = await PlatformConversionService.convertToPlatform(
          mergedInfo,
          copy,
          selectedPlatform
        );
        setConvertedContent(converted);
      } catch (error) {
        alert('網址分析或平台轉換失敗，請檢查網址是否正確或手動輸入商品資訊');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!productInfo.name) {
      alert('請輸入商品名稱或商品網址');
      return;
    }

    setLoading(true);
    try {
      // 先生成基礎文案
      const copy = await CopywritingService.generateCopy(productInfo, CopywritingType.ECOMMERCE);

      // 轉換為平台格式
      const converted = await PlatformConversionService.convertToPlatform(
        productInfo,
        copy,
        selectedPlatform
      );

      setConvertedContent(converted);
    } catch (error) {
      alert('平台轉換失敗');
    } finally {
      setLoading(false);
    }
  };

  // 下載 CSV
  const handleDownloadCsv = () => {
    if (!convertedContent?.csvData) return;

    const blob = new Blob([convertedContent.csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedPlatform}_${Date.now()}.csv`;
    link.click();
  };

  const platformOptions = [
    {
      value: Platform.SHOPEE,
      label: '蝦皮 Shopee',
      icon: '🛒',
      color: 'orange',
      features: ['標題60字', '規格列表', '賣點整理', 'CSV匯出']
    },
    {
      value: Platform.MOMO,
      label: 'Momo 購物',
      icon: '🎯',
      color: 'red',
      features: ['分段描述', '特色點整理', '規格表']
    }
  ];

  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">多平台格式轉換</h2>
        <p className="text-gray-600 mt-1">
          自動轉換為各電商平台格式，一鍵匯出可上架的 CSV
        </p>
      </div>

      {/* 商品資訊 */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">商品資訊</h3>

        {/* 商品網址 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            商品網址（貼上網址後，點選下方「開始轉換」即可自動分析）
          </label>
          <input
            type="url"
            value={productInfo.url}
            onChange={(e) => setProductInfo({ ...productInfo, url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://www.mefu.com.tw/products/ai-instant-selfie-stick-cy147"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              商品名稱（選填，請手動輸入或留空）
            </label>
            <input
              type="text"
              value={productInfo.name}
              onChange={(e) => setProductInfo({ ...productInfo, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="請手動輸入"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              價格（選填）
            </label>
            <input
              type="number"
              value={productInfo.price}
              onChange={(e) => setProductInfo({ ...productInfo, price: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="599"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            商品描述（選填）
          </label>
          <textarea
            value={productInfo.description}
            onChange={(e) => setProductInfo({ ...productInfo, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="簡單描述商品特色..."
          />
        </div>
      </div>

      {/* 選擇平台 */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">選擇目標平台</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {platformOptions.map(platform => (
            <button
              key={platform.value}
              onClick={() => setSelectedPlatform(platform.value)}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                selectedPlatform === platform.value
                  ? `border-${platform.color}-500 bg-${platform.color}-50`
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl">{platform.icon}</div>
                <div className="font-semibold text-lg text-gray-800">{platform.label}</div>
              </div>
              <div className="space-y-1">
                {platform.features.map((feature, i) => (
                  <div key={i} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 轉換按鈕 */}
      <div className="flex justify-center">
        <button
          onClick={handleConvert}
          disabled={loading || (!productInfo.name && !productInfo.url)}
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-3 text-lg font-medium shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              {productInfo.url && !productInfo.name ? 'AI 分析與轉換中...' : '轉換中...'}
            </>
          ) : (
            <>
              <Wand2 size={24} />
              開始轉換
            </>
          )}
        </button>
      </div>

      {/* 轉換結果 */}
      {convertedContent && (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">
              {convertedContent.platform.toUpperCase()} 格式
            </h3>
            {convertedContent.csvData && (
              <button
                onClick={handleDownloadCsv}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download size={18} />
                下載 CSV
              </button>
            )}
          </div>

          {/* 標題 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              商品標題
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-medium text-gray-800">{convertedContent.title}</div>
              <div className="text-xs text-gray-500 mt-1">
                {convertedContent.title.length} / 60 字
              </div>
            </div>
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              商品描述
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap text-gray-700">
              {convertedContent.description}
            </div>
          </div>

          {/* 規格 */}
          {convertedContent.specifications && convertedContent.specifications.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商品規格
              </label>
              <div className="space-y-2">
                {convertedContent.specifications.map((spec, i) => (
                  <div key={i} className="p-3 bg-blue-50 rounded-lg text-blue-900 text-sm">
                    {spec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 賣點 */}
          {convertedContent.sellingPoints && convertedContent.sellingPoints.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商品賣點
              </label>
              <div className="grid md:grid-cols-2 gap-2">
                {convertedContent.sellingPoints.map((point, i) => (
                  <div key={i} className="p-3 bg-green-50 rounded-lg text-green-800 text-sm flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CSV 預覽 */}
          {convertedContent.csvData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CSV 預覽
              </label>
              <div className="p-4 bg-gray-900 rounded-lg text-gray-100 text-xs font-mono overflow-x-auto">
                <pre>{convertedContent.csvData}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
