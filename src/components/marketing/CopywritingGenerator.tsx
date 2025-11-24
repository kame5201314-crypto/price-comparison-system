import { useState } from 'react';
import { Copy, Download, Save, Wand2, Loader2, FileSpreadsheet } from 'lucide-react';
import {
  ProductInfo,
  CopywritingType,
  GeneratedCopy
} from '../../types/marketing';
import { CopywritingService } from '../../services/aiMarketingService';

export default function CopywritingGenerator() {
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    name: '',
    url: '',
    description: ''
  });

  const [selectedTypes, setSelectedTypes] = useState<CopywritingType[]>([
    CopywritingType.SEO
  ]);

  const [generatedCopies, setGeneratedCopies] = useState<GeneratedCopy[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCopy, setEditingCopy] = useState<string | null>(null);

  // 生成文案（自動處理網址分析）
  const handleGenerate = async () => {
    // 如果有網址但沒有商品名稱，先分析網址
    if (productInfo.url && !productInfo.name) {
      setLoading(true);
      try {
        const analyzedInfo = await CopywritingService.analyzeProductUrl(productInfo.url);
        setProductInfo(prev => ({ ...prev, ...analyzedInfo }));

        // 分析完成後繼續生成文案
        const copies = await CopywritingService.generateMultipleCopies(
          { ...productInfo, ...analyzedInfo },
          selectedTypes
        );
        setGeneratedCopies(copies);
      } catch (error) {
        alert('網址分析或文案生成失敗，請檢查網址是否正確');
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

    // 直接生成文案
    setLoading(true);
    try {
      const copies = await CopywritingService.generateMultipleCopies(
        productInfo,
        selectedTypes
      );
      setGeneratedCopies(copies);
    } catch (error) {
      alert('文案生成失敗');
    } finally {
      setLoading(false);
    }
  };

  // 複製文案
  const handleCopy = (copy: GeneratedCopy) => {
    const text = `${copy.title}\n\n${copy.content}`;
    navigator.clipboard.writeText(text);
    alert('已複製到剪貼簿！');
  };

  // 匯出 CSV
  const handleExportCsv = () => {
    const csv = CopywritingService.exportToCsv(generatedCopies);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `product_copies_${Date.now()}.csv`;
    link.click();
  };

  // 匯出蝦皮格式表格
  const handleExportShopeeTable = () => {
    // 找出蝦皮相關的文案
    const shopeeTitle = generatedCopies.find(c => c.type === CopywritingType.SHOPEE_TITLE);
    const shopeeSpec = generatedCopies.find(c => c.type === CopywritingType.SHOPEE_SPEC);
    const productSpec = generatedCopies.find(c => c.type === CopywritingType.PRODUCT_SPEC);
    const productFeatures = generatedCopies.find(c => c.type === CopywritingType.PRODUCT_FEATURES);
    const productOptions = generatedCopies.find(c => c.type === CopywritingType.PRODUCT_OPTIONS);

    // 建立蝦皮上架用的 CSV
    const headers = [
      '商品名稱',
      '蝦皮標題',
      '商品規格',
      '商品特色',
      '商品選項',
      '蝦皮規格賣點'
    ];

    const row = [
      productInfo.name || '',
      shopeeTitle?.title || '',
      productSpec?.content || '',
      productFeatures?.content || '',
      productOptions?.content || '',
      shopeeSpec?.content || ''
    ];

    const csvContent = [
      '\uFEFF' + headers.join(','), // BOM for Excel UTF-8
      row.map(cell => `"${cell.replace(/"/g, '""').replace(/\n/g, '\n')}"`).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `shopee_product_${Date.now()}.csv`;
    link.click();
  };

  // 切換文案類型選擇
  const toggleType = (type: CopywritingType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // 文案類型標籤
  const typeLabels: Record<CopywritingType, string> = {
    [CopywritingType.SEO]: 'SEO 版',
    [CopywritingType.ECOMMERCE]: '電商銷售版',
    [CopywritingType.EMOTIONAL]: '感性故事版',
    [CopywritingType.SHORT_TITLE]: '短標題',
    [CopywritingType.SHOPEE_SPEC]: '蝦皮規格＋賣點',
    [CopywritingType.SHOPEE_TITLE]: '蝦皮標題',
    [CopywritingType.PRODUCT_SPEC]: '商品規格',
    [CopywritingType.PRODUCT_FEATURES]: '商品特色',
    [CopywritingType.PRODUCT_OPTIONS]: '商品選項'
  };

  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">AI 商品文案自動生成</h2>
        <p className="text-gray-600 mt-1">
          輸入商品資訊或網址，AI 自動分析並生成多種風格文案
        </p>
      </div>

      {/* 商品資訊輸入 */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">商品資訊</h3>

        {/* 商品網址 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            商品網址（貼上網址後，點選下方「開始生成文案」即可自動分析）
          </label>
          <input
            type="url"
            value={productInfo.url}
            onChange={(e) => setProductInfo({ ...productInfo, url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://www.mefu.com.tw/products/ai-instant-selfie-stick-cy147"
          />
        </div>

        {/* 商品名稱 */}
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

        {/* 商品描述 */}
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

      {/* 選擇文案類型 */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">選擇產出文案類型</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.values(CopywritingType).map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-4 py-3 rounded-lg border-2 transition-all ${
                selectedTypes.includes(type)
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              {typeLabels[type]}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          已選擇 {selectedTypes.length} 種文案類型
        </p>
      </div>

      {/* 生成按鈕 */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={loading || (!productInfo.name && !productInfo.url) || selectedTypes.length === 0}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-3 text-lg font-medium shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              AI 分析與生成中...
            </>
          ) : (
            <>
              <Wand2 size={24} />
              開始生成文案
            </>
          )}
        </button>
      </div>

      {/* 生成結果 */}
      {generatedCopies.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-xl font-semibold text-gray-800">
              生成結果（{generatedCopies.length} 篇）
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleExportShopeeTable}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
              >
                <FileSpreadsheet size={18} />
                匯出蝦皮表格
              </button>
              <button
                onClick={handleExportCsv}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download size={18} />
                匯出 CSV
              </button>
            </div>
          </div>

          {generatedCopies.map(copy => (
            <div
              key={copy.id}
              className="bg-white rounded-lg shadow p-6 space-y-4 border-l-4 border-blue-500"
            >
              {/* 文案類型標籤 */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {typeLabels[copy.type]}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(copy)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-1 text-sm"
                  >
                    <Copy size={16} />
                    複製
                  </button>
                  <button
                    onClick={() => setEditingCopy(editingCopy === copy.id ? null : copy.id)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-1 text-sm"
                  >
                    編輯
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-1 text-sm">
                    <Save size={16} />
                    存為模板
                  </button>
                </div>
              </div>

              {/* 標題 */}
              {editingCopy === copy.id ? (
                <input
                  type="text"
                  defaultValue={copy.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded font-semibold text-lg"
                />
              ) : (
                <h4 className="font-semibold text-lg text-gray-800">{copy.title}</h4>
              )}

              {/* 內容 */}
              {editingCopy === copy.id ? (
                <textarea
                  defaultValue={copy.content}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows={10}
                />
              ) : (
                <div className="text-gray-700 whitespace-pre-wrap">{copy.content}</div>
              )}

              {/* 關鍵字 */}
              {copy.keywords && copy.keywords.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">關鍵字：</p>
                  <div className="flex flex-wrap gap-2">
                    {copy.keywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
