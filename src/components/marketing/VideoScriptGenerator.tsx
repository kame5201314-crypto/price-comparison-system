import { useState } from 'react';
import { Video, Download, Loader2, Wand2, FileText } from 'lucide-react';
import { ProductInfo, VideoStyle, VideoScript } from '../../types/marketing';
import { VideoScriptService } from '../../services/aiMarketingService';

export default function VideoScriptGenerator() {
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    name: '',
    description: ''
  });

  const [selectedStyle, setSelectedStyle] = useState<VideoStyle>(VideoStyle.SALES_TALK);
  const [duration, setDuration] = useState(15);
  const [script, setScript] = useState<VideoScript | null>(null);
  const [loading, setLoading] = useState(false);

  // 生成腳本
  const handleGenerate = async () => {
    if (!productInfo.name) {
      alert('請輸入商品名稱');
      return;
    }

    setLoading(true);
    try {
      const generated = await VideoScriptService.generateScript(
        productInfo,
        selectedStyle,
        duration
      );
      setScript(generated);
    } catch (error) {
      alert('腳本生成失敗');
    } finally {
      setLoading(false);
    }
  };

  // 匯出拍攝清單
  const handleExport = () => {
    if (!script) return;

    const shootingList = VideoScriptService.exportShootingList(script);
    const blob = new Blob([shootingList], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `shooting_list_${Date.now()}.txt`;
    link.click();
  };

  const styleOptions = [
    {
      value: VideoStyle.SALES_TALK,
      label: '帶貨口播',
      description: '主持人介紹產品特色',
      icon: '🎤'
    },
    {
      value: VideoStyle.PRODUCT_DISPLAY,
      label: '商品展示',
      description: '360度產品展示',
      icon: '📦'
    },
    {
      value: VideoStyle.STORY_TELLING,
      label: '情境故事',
      description: '用故事呈現產品',
      icon: '📖'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">影音腳本 AI 生成</h2>
        <p className="text-gray-600 mt-1">
          自動生成 TikTok、Reels 短影音腳本，含分鏡表、拍攝建議
        </p>
      </div>

      {/* 商品資訊 */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">商品資訊</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            商品名稱 *
          </label>
          <input
            type="text"
            value={productInfo.name}
            onChange={(e) => setProductInfo({ ...productInfo, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="例：智能藍牙自拍棒"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            商品描述
          </label>
          <textarea
            value={productInfo.description}
            onChange={(e) => setProductInfo({ ...productInfo, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="簡單描述商品特色和賣點..."
          />
        </div>
      </div>

      {/* 影片風格 */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">選擇影片風格</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {styleOptions.map(style => (
            <button
              key={style.value}
              onClick={() => setSelectedStyle(style.value)}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                selectedStyle === style.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="text-4xl mb-3">{style.icon}</div>
              <div className="font-semibold text-gray-800 mb-1">{style.label}</div>
              <div className="text-sm text-gray-500">{style.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 影片長度 */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">影片長度</h3>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              時長：{duration} 秒
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setDuration(15)}
                className={`px-3 py-1 rounded ${duration === 15 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                15秒
              </button>
              <button
                onClick={() => setDuration(30)}
                className={`px-3 py-1 rounded ${duration === 30 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                30秒
              </button>
              <button
                onClick={() => setDuration(60)}
                className={`px-3 py-1 rounded ${duration === 60 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                60秒
              </button>
            </div>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="5"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* 生成按鈕 */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={loading || !productInfo.name}
          className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-3 text-lg font-medium shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              AI 生成中...
            </>
          ) : (
            <>
              <Wand2 size={24} />
              開始生成腳本
            </>
          )}
        </button>
      </div>

      {/* 生成結果 */}
      {script && (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">腳本內容</h3>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download size={18} />
              匯出拍攝清單
            </button>
          </div>

          {/* 基本資訊 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm text-gray-600">風格</div>
              <div className="font-medium">{script.style}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">時長</div>
              <div className="font-medium">{script.duration} 秒</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">場景數</div>
              <div className="font-medium">{script.scenes.length} 個</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">音樂風格</div>
              <div className="font-medium text-sm">{script.musicStyle}</div>
            </div>
          </div>

          {/* 分鏡表 */}
          <div>
            <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <Video size={20} />
              分鏡表
            </h4>
            <div className="space-y-4">
              {script.scenes.map((scene, index) => (
                <div
                  key={scene.sceneNumber}
                  className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-gray-800">
                      場景 {scene.sceneNumber}
                    </div>
                    <div className="text-sm text-gray-600">{scene.duration} 秒</div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">畫面：</span>
                      <span className="text-gray-600">{scene.description}</span>
                    </div>

                    {scene.voiceover && (
                      <div>
                        <span className="font-medium text-gray-700">旁白：</span>
                        <span className="text-gray-600">「{scene.voiceover}」</span>
                      </div>
                    )}

                    <div>
                      <span className="font-medium text-gray-700">鏡位：</span>
                      <span className="text-gray-600">{scene.cameraAngle}</span>
                    </div>

                    {scene.props && scene.props.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">道具：</span>
                        <span className="text-gray-600">{scene.props.join('、')}</span>
                      </div>
                    )}
                  </div>

                  {/* 轉場效果 */}
                  {index < script.transitions.length && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500">
                        轉場：{script.transitions[index]}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 拍攝重點 */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
              <FileText size={20} />
              拍攝重點提示
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900 mb-2">鏡位建議</div>
                <div className="text-sm text-blue-700">
                  {script.cameraAngles.join('、')}
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-900 mb-2">配樂風格</div>
                <div className="text-sm text-purple-700">{script.musicStyle}</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-l-4 border-orange-500">
            <div className="font-medium text-orange-900 mb-1">結尾 CTA</div>
            <div className="text-orange-800">{script.cta}</div>
          </div>
        </div>
      )}
    </div>
  );
}
