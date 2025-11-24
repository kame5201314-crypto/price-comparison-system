import { useState } from 'react';
import { Facebook, Loader2, Wand2, Copy, CheckCircle, XCircle } from 'lucide-react';
import { ProductInfo, FBAdCreative } from '../../types/marketing';
import { FBAdService, CopywritingService } from '../../services/aiMarketingService';

export default function FBAdGenerator() {
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    name: '',
    url: '',
    description: '',
    price: 0
  });

  const [adCount, setAdCount] = useState(5);
  const [ads, setAds] = useState<FBAdCreative[]>([]);
  const [loading, setLoading] = useState(false);

  // 生成廣告（自動處理網址分析）
  const handleGenerate = async () => {
    // 如果有網址但沒有商品名稱，先分析網址
    if (productInfo.url && !productInfo.name) {
      setLoading(true);
      try {
        const analyzedInfo = await CopywritingService.analyzeProductUrl(productInfo.url);
        const mergedInfo = { ...productInfo, ...analyzedInfo };
        setProductInfo(mergedInfo);

        // 分析完成後繼續生成廣告
        const generated = await FBAdService.generateAds(mergedInfo, adCount);
        setAds(generated);
      } catch (error) {
        alert('網址分析或廣告生成失敗，請檢查網址是否正確或手動輸入商品資訊');
      } finally {
        setLoading(false);
      }
      return;
    }

    // 如果沒有商品名稱，提示錯誤
    if (!productInfo.name) {
      alert('請輸入商品名稱或商品網址');
      return;
    }

    // 直接生成廣告
    setLoading(true);
    try {
      const generated = await FBAdService.generateAds(productInfo, adCount);
      setAds(generated);
    } catch (error) {
      alert('廣告生成失敗');
    } finally {
      setLoading(false);
    }
  };

  // 複製廣告文案
  const handleCopy = (ad: FBAdCreative) => {
    const text = `【${ad.headline}】\n\n${ad.primaryText}\n\n${ad.description}\n\nCTA: ${ad.callToAction}`;
    navigator.clipboard.writeText(text);
    alert('已複製到剪貼簿！');
  };

  // 驗證廣告格式
  const validateAd = (ad: FBAdCreative) => {
    return FBAdService.validateAdFormat(ad);
  };

  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">FB 廣告素材自動生成</h2>
        <p className="text-gray-600 mt-1">
          依據產品類型自動生成符合 Facebook 規格的廣告文案與素材
        </p>
      </div>

      {/* 商品資訊 */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">商品資訊</h3>

        {/* 商品網址 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            商品網址（貼上網址後，點選下方「開始生成廣告」即可自動分析）
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
              onChange={(e) => setProductInfo({ ...productInfo, price: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
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

        {/* 生成數量 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            生成數量：{adCount} 篇
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={adCount}
            onChange={(e) => setAdCount(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 篇</span>
            <span>10 篇</span>
          </div>
        </div>
      </div>

      {/* 生成按鈕 */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={loading || (!productInfo.name && !productInfo.url)}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-3 text-lg font-medium shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              AI 分析與生成中...
            </>
          ) : (
            <>
              <Wand2 size={24} />
              開始生成廣告
            </>
          )}
        </button>
      </div>

      {/* 生成結果 */}
      {ads.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            生成結果（{ads.length} 篇）
          </h3>

          {ads.map((ad, index) => {
            const validation = validateAd(ad);
            return (
              <div
                key={ad.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-blue-600"
              >
                {/* FB 廣告模擬介面 */}
                <div className="p-6">
                  {/* 標題列 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Facebook className="text-blue-600" size={24} />
                      <span className="font-semibold text-gray-800">FB 廣告 #{index + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {validation.valid ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle size={16} />
                          格式正確
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 text-sm">
                          <XCircle size={16} />
                          需調整
                        </span>
                      )}
                      <button
                        onClick={() => handleCopy(ad)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-1 text-sm"
                      >
                        <Copy size={14} />
                        複製
                      </button>
                    </div>
                  </div>

                  {/* 驗證錯誤 */}
                  {!validation.valid && (
                    <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-sm font-medium text-red-800 mb-1">格式問題：</div>
                      <ul className="text-sm text-red-700 space-y-1">
                        {validation.errors.map((error, i) => (
                          <li key={i}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* FB 廣告預覽 */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* 圖片區 */}
                    <div className="bg-gray-100 aspect-[1.91/1] flex items-center justify-center">
                      {ad.image ? (
                        <img src={ad.image} alt="廣告圖片" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-gray-400">1200 x 628 px</div>
                      )}
                    </div>

                    {/* 文案區 */}
                    <div className="p-4 bg-white space-y-3">
                      {/* 主要文字 */}
                      <div>
                        <div className="text-xs text-gray-500 mb-1">主要文字</div>
                        <div className="text-gray-800 whitespace-pre-wrap">{ad.primaryText}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {ad.primaryText.length} 字
                          {ad.primaryText.length > 125 && ' (超過建議長度)'}
                        </div>
                      </div>

                      {/* 標題 */}
                      <div className="pt-3 border-t">
                        <div className="text-xs text-gray-500 mb-1">標題</div>
                        <div className="font-semibold text-gray-900">{ad.headline}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {ad.headline.length} / 40 字
                        </div>
                      </div>

                      {/* 說明 */}
                      <div>
                        <div className="text-xs text-gray-500 mb-1">說明</div>
                        <div className="text-sm text-gray-600">{ad.description}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {ad.description.length} / 30 字
                        </div>
                      </div>

                      {/* CTA 按鈕 */}
                      <div className="pt-3">
                        <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                          {ad.callToAction}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* FB 廣告規格說明 */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">📱 Facebook 廣告規格說明</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <div className="font-medium mb-1">文字限制：</div>
                <ul className="space-y-1 text-blue-700">
                  <li>• 主要文字：建議 125 字內（完整顯示）</li>
                  <li>• 標題：40 字以內</li>
                  <li>• 說明：30 字以內</li>
                </ul>
              </div>
              <div>
                <div className="font-medium mb-1">圖片規格：</div>
                <ul className="space-y-1 text-blue-700">
                  <li>• 建議尺寸：1200 x 628 px</li>
                  <li>• 比例：1.91:1</li>
                  <li>• 圖片中文字不超過 20%</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
