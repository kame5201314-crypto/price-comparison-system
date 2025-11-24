import { useState } from 'react';
import { Image as ImageIcon, Download, Loader2, Wand2, PackageOpen } from 'lucide-react';
import {
  ImageStyle,
  BackgroundType,
  ImageGenerationOptions,
  GeneratedImage
} from '../../types/marketing';
import { ImageGenerationService } from '../../services/aiMarketingService';

export default function ImageGenerator() {
  const [productImage, setProductImage] = useState('');
  const [options, setOptions] = useState<Partial<ImageGenerationOptions>>({
    style: ImageStyle.IG_STYLE,
    background: BackgroundType.WHITE,
    count: 5,
    addLogo: false,
    removeBackground: false
  });

  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // 生成圖片
  const handleGenerate = async () => {
    if (!productImage) {
      alert('請上傳商品圖片');
      return;
    }

    setLoading(true);
    try {
      const images = await ImageGenerationService.generateImages({
        productImage,
        style: options.style!,
        background: options.background!,
        count: options.count!,
        addLogo: options.addLogo,
        removeBackground: options.removeBackground
      });
      setGeneratedImages(images);
    } catch (error) {
      alert('圖片生成失敗');
    } finally {
      setLoading(false);
    }
  };

  // 圖片上傳
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProductImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 切換圖片選擇
  const toggleImageSelection = (imageId: string) => {
    if (selectedImages.includes(imageId)) {
      setSelectedImages(selectedImages.filter(id => id !== imageId));
    } else {
      setSelectedImages([...selectedImages, imageId]);
    }
  };

  // 下載選中的圖片
  const handleDownloadSelected = async () => {
    if (selectedImages.length === 0) {
      alert('請先選擇要下載的圖片');
      return;
    }

    const selected = generatedImages.filter(img => selectedImages.includes(img.id));
    const zip = await ImageGenerationService.downloadAsZip(selected);

    const link = document.createElement('a');
    link.href = URL.createObjectURL(zip);
    link.download = `product_images_${Date.now()}.zip`;
    link.click();
  };

  // 風格選項
  const styleOptions = [
    { value: ImageStyle.IG_STYLE, label: 'IG 風格', description: '適合社群媒體' },
    { value: ImageStyle.FRESH_GIRL, label: '清新少女', description: '柔和清新風格' },
    { value: ImageStyle.TECH_MALE, label: '男性科技感', description: '專業科技風' },
    { value: ImageStyle.JAPAN_MINIMAL, label: '日本簡約', description: '無印良品風' }
  ];

  // 背景選項
  const backgroundOptions = [
    { value: BackgroundType.WHITE, label: '純白背景', icon: '⚪' },
    { value: BackgroundType.WOOD_TABLE, label: '木桌', icon: '🪵' },
    { value: BackgroundType.MARBLE, label: '大理石', icon: '⬜' },
    { value: BackgroundType.KITCHEN, label: '廚房', icon: '🍳' },
    { value: BackgroundType.OUTDOOR, label: '戶外', icon: '🌳' },
    { value: BackgroundType.BATHROOM, label: '浴室', icon: '🚿' }
  ];

  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">AI 批次產圖</h2>
        <p className="text-gray-600 mt-1">
          上傳商品照片，AI 自動生成不同風格與背景的情境圖
        </p>
      </div>

      {/* 圖片上傳 */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">上傳商品圖片</h3>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          {productImage ? (
            <div className="space-y-4">
              <img
                src={productImage}
                alt="商品預覽"
                className="max-h-64 mx-auto rounded-lg shadow"
              />
              <button
                onClick={() => setProductImage('')}
                className="text-sm text-red-600 hover:text-red-700"
              >
                重新上傳
              </button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">點擊上傳商品圖片</p>
              <p className="text-sm text-gray-400 mt-2">支援 JPG、PNG 格式</p>
            </label>
          )}
        </div>
      </div>

      {/* 風格選擇 */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">選擇風格模板</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {styleOptions.map(style => (
            <button
              key={style.value}
              onClick={() => setOptions({ ...options, style: style.value })}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                options.style === style.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-gray-800">{style.label}</div>
              <div className="text-sm text-gray-500 mt-1">{style.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 背景選擇 */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">選擇背景</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {backgroundOptions.map(bg => (
            <button
              key={bg.value}
              onClick={() => setOptions({ ...options, background: bg.value })}
              className={`p-4 rounded-lg border-2 transition-all ${
                options.background === bg.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="text-3xl mb-2">{bg.icon}</div>
              <div className="text-sm font-medium text-gray-700">{bg.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 進階選項 */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">進階選項</h3>

        {/* 生成數量 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            生成數量：{options.count} 張
          </label>
          <input
            type="range"
            min="3"
            max="20"
            value={options.count}
            onChange={(e) => setOptions({ ...options, count: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>3 張</span>
            <span>20 張</span>
          </div>
        </div>

        {/* 其他選項 */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.removeBackground}
              onChange={(e) => setOptions({ ...options, removeBackground: e.target.checked })}
              className="w-5 h-5 text-blue-600"
            />
            <div>
              <div className="font-medium text-gray-700">自動去背</div>
              <div className="text-sm text-gray-500">移除原始背景，更容易合成</div>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.addLogo}
              onChange={(e) => setOptions({ ...options, addLogo: e.target.checked })}
              className="w-5 h-5 text-blue-600"
            />
            <div>
              <div className="font-medium text-gray-700">加入 Logo</div>
              <div className="text-sm text-gray-500">在圖片上添加品牌標誌</div>
            </div>
          </label>
        </div>
      </div>

      {/* 生成按鈕 */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={loading || !productImage}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-3 text-lg font-medium shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              AI 生成中...
            </>
          ) : (
            <>
              <Wand2 size={24} />
              開始生成圖片
            </>
          )}
        </button>
      </div>

      {/* 生成結果 */}
      {generatedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">
              生成結果（{generatedImages.length} 張）
            </h3>
            <div className="flex gap-3">
              <span className="text-sm text-gray-600 py-2">
                已選擇 {selectedImages.length} 張
              </span>
              <button
                onClick={handleDownloadSelected}
                disabled={selectedImages.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <PackageOpen size={18} />
                打包下載 ZIP
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {generatedImages.map(image => (
              <div
                key={image.id}
                className={`relative group rounded-lg overflow-hidden border-4 transition-all cursor-pointer ${
                  selectedImages.includes(image.id)
                    ? 'border-blue-500 shadow-lg'
                    : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => toggleImageSelection(image.id)}
              >
                <img
                  src={image.url}
                  alt="生成的圖片"
                  className="w-full aspect-square object-cover"
                />

                {/* 選擇標記 */}
                <div
                  className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedImages.includes(image.id)
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-white border-gray-300 group-hover:border-gray-400'
                  }`}
                >
                  {selectedImages.includes(image.id) && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                {/* 懸停操作 */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const link = document.createElement('a');
                      link.href = image.url;
                      link.download = `image_${image.id}.jpg`;
                      link.click();
                    }}
                    className="px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Download size={16} />
                    下載
                  </button>
                </div>

                {/* 圖片資訊 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <div>風格：{image.style}</div>
                  <div>背景：{image.background}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
