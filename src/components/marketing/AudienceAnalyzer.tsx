import { useState } from 'react';
import { Users, Loader2, Wand2, Link, TrendingUp } from 'lucide-react';
import { ProductInfo, AudienceAnalysis } from '../../types/marketing';
import { AudienceAnalysisService } from '../../services/aiMarketingService';

export default function AudienceAnalyzer() {
  const [productInput, setProductInput] = useState({
    name: '',
    url: ''
  });

  const [analysis, setAnalysis] = useState<AudienceAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  // 分析受眾（使用商品名稱）
  const handleAnalyze = async () => {
    if (!productInput.name) {
      alert('請輸入商品名稱');
      return;
    }

    setLoading(true);
    try {
      const result = await AudienceAnalysisService.analyzeAudience({
        name: productInput.name
      } as ProductInfo);
      setAnalysis(result);
    } catch (error) {
      alert('受眾分析失敗');
    } finally {
      setLoading(false);
    }
  };

  // 分析受眾（使用網址）
  const handleAnalyzeByUrl = async () => {
    if (!productInput.url) {
      alert('請輸入商品網址');
      return;
    }

    setLoading(true);
    try {
      const result = await AudienceAnalysisService.analyzeAudienceByUrl(productInput.url);
      setAnalysis(result);
    } catch (error) {
      alert('受眾分析失敗');
    } finally {
      setLoading(false);
    }
  };

  // 受眾規模顯示
  const getSizeLabel = (size: 'small' | 'medium' | 'large') => {
    const labels = {
      small: { text: '小眾市場', color: 'yellow', icon: '📊' },
      medium: { text: '中型市場', color: 'blue', icon: '📈' },
      large: { text: '大眾市場', color: 'green', icon: '🚀' }
    };
    return labels[size];
  };

  // 相關性分數顏色
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">受眾分析</h2>
        <p className="text-gray-600 mt-1">
          提供商品名稱或網址，系統自動分析可能的受眾群體與建議平台
        </p>
      </div>

      {/* 輸入區 */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">商品資訊</h3>

        {/* 方式一：商品名稱 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            商品名稱
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={productInput.name}
              onChange={(e) => setProductInput({ ...productInput, name: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例：自拍棒、智能手環、咖啡機..."
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !productInput.name}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  分析中
                </>
              ) : (
                <>
                  <Wand2 size={18} />
                  分析
                </>
              )}
            </button>
          </div>
        </div>

        {/* 分隔線 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">或</span>
          </div>
        </div>

        {/* 方式二：商品網址 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            商品網址（AI 自動分析）
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={productInput.url}
              onChange={(e) => setProductInput({ ...productInput, url: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://..."
            />
            <button
              onClick={handleAnalyzeByUrl}
              disabled={loading || !productInput.url}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  分析中
                </>
              ) : (
                <>
                  <Link size={18} />
                  分析
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 分析結果 */}
      {analysis && (
        <div className="space-y-6">
          {/* 產品名稱 */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="text-sm opacity-90 mb-1">分析產品</div>
            <div className="text-2xl font-bold">{analysis.productName}</div>
          </div>

          {/* 建議受眾群體 */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Users size={24} />
              建議受眾群體
            </h3>

            <div className="grid gap-4">
              {analysis.suggestedAudiences.map((audience, index) => {
                const sizeInfo = getSizeLabel(audience.size);
                return (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {audience.name}
                          </h4>
                          <span className={`px-3 py-1 bg-${sizeInfo.color}-100 text-${sizeInfo.color}-700 rounded-full text-xs font-medium flex items-center gap-1`}>
                            {sizeInfo.icon} {sizeInfo.text}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{audience.description}</p>
                      </div>

                      {/* 相關性分數 */}
                      <div className="ml-4 text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(audience.relevanceScore)}`}>
                          {audience.relevanceScore}
                        </div>
                        <div className="text-xs text-gray-500">相關性</div>
                      </div>
                    </div>

                    {/* 建議平台 */}
                    <div className="pt-3 border-t">
                      <div className="text-sm text-gray-600 mb-2">建議投放平台：</div>
                      <div className="flex flex-wrap gap-2">
                        {audience.suggestedPlatforms.map((platform, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 人口統計資訊 */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp size={24} />
              人口統計分析
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 年齡範圍 */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">年齡範圍</div>
                <div className="flex flex-wrap gap-2">
                  {analysis.demographics.ageRange.map((age, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium"
                    >
                      {age}
                    </span>
                  ))}
                </div>
              </div>

              {/* 性別分布 */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">性別分布</div>
                <div className="flex flex-wrap gap-2">
                  {analysis.demographics.gender.map((gender, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg font-medium"
                    >
                      {gender}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 興趣標籤 */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">興趣標籤</div>
              <div className="flex flex-wrap gap-2">
                {analysis.demographics.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* 行為特徵 */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">行為特徵</div>
              <div className="space-y-2">
                {analysis.demographics.behaviors.map((behavior, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <span className="text-blue-500">✓</span>
                    {behavior}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 關鍵字建議 */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">關鍵字建議</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.map((keyword, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium hover:bg-yellow-200 transition-colors cursor-pointer"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          </div>

          {/* 目標市場 */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">目標市場</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {analysis.targetMarkets.map((market, i) => (
                <div
                  key={i}
                  className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg text-center font-medium text-gray-800"
                >
                  🌏 {market}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
