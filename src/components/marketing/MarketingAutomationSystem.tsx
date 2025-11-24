import { useState } from 'react';
import {
  FileText,
  Image,
  Video,
  ShoppingBag,
  Facebook,
  Users,
  Sparkles,
  Home
} from 'lucide-react';
import CopywritingGenerator from './CopywritingGenerator';
import ImageGenerator from './ImageGenerator';
import VideoScriptGenerator from './VideoScriptGenerator';
import PlatformConverter from './PlatformConverter';
import FBAdGenerator from './FBAdGenerator';
import AudienceAnalyzer from './AudienceAnalyzer';

type TabType = 'home' | 'copywriting' | 'image' | 'video' | 'platform' | 'fbad' | 'audience';

export default function MarketingAutomationSystem() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const tabs = [
    {
      id: 'home' as TabType,
      label: '首頁',
      icon: Home,
      color: 'gray'
    },
    {
      id: 'copywriting' as TabType,
      label: 'AI 文案生成',
      icon: FileText,
      color: 'blue',
      description: '5種文案類型自動生成'
    },
    {
      id: 'image' as TabType,
      label: 'AI 批次產圖',
      icon: Image,
      color: 'purple',
      description: '背景替換、情境生成'
    },
    {
      id: 'video' as TabType,
      label: '影片腳本',
      icon: Video,
      color: 'red',
      description: 'TikTok、Reels 腳本'
    },
    {
      id: 'platform' as TabType,
      label: '平台轉換',
      icon: ShoppingBag,
      color: 'green',
      description: '蝦皮、Momo 格式'
    },
    {
      id: 'fbad' as TabType,
      label: 'FB 廣告',
      icon: Facebook,
      color: 'indigo',
      description: '自動生成廣告素材'
    },
    {
      id: 'audience' as TabType,
      label: '受眾分析',
      icon: Users,
      color: 'pink',
      description: '智能受眾推薦'
    }
  ];

  // 渲染主頁
  const renderHome = () => (
    <div className="space-y-8">
      {/* 歡迎橫幅 */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles size={32} />
          <h1 className="text-3xl font-bold">電商行銷自動化系統</h1>
        </div>
        <p className="text-lg opacity-90">
          運用 AI 技術，一站式解決電商行銷所有需求
        </p>
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">6+</div>
            <div className="text-sm opacity-90">AI 自動化工具</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">5+</div>
            <div className="text-sm opacity-90">平台格式支援</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm opacity-90">效率提升</div>
          </div>
        </div>
      </div>

      {/* 功能卡片 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">核心功能</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tabs.slice(1).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="text-left bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 border-2 border-transparent hover:border-blue-200"
              >
                <div className={`w-12 h-12 bg-${tab.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`text-${tab.color}-600`} size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {tab.label}
                </h3>
                <p className="text-gray-600 text-sm">
                  {tab.description}
                </p>
                <div className="mt-4 text-blue-600 text-sm font-medium flex items-center gap-1">
                  開始使用
                  <span>→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 使用流程 */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">使用流程</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">
              1
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">輸入商品資訊</h3>
            <p className="text-sm text-gray-600">
              商品名稱、網址或簡單描述
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-600">
              2
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">AI 自動生成</h3>
            <p className="text-sm text-gray-600">
              文案、圖片、腳本一鍵產出
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-600">
              3
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">匯出使用</h3>
            <p className="text-sm text-gray-600">
              編輯調整後匯出到各平台
            </p>
          </div>
        </div>
      </div>

      {/* 特色說明 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🎯 智能分析</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• AI 自動分析商品屬性（顏色、用途等）</li>
            <li>• 智能推薦受眾群體</li>
            <li>• 自動偵測最佳平台</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">⚡ 高效產出</h3>
          <ul className="space-y-2 text-purple-800 text-sm">
            <li>• 批次生成 3-20 張產品圖</li>
            <li>• 一次產出 5-10 篇廣告文案</li>
            <li>• 多平台格式一鍵轉換</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">📱 多平台支援</h3>
          <ul className="space-y-2 text-green-800 text-sm">
            <li>• 蝦皮 Shopee、Momo 購物</li>
            <li>• Facebook、Instagram 廣告</li>
            <li>• TikTok、Reels 短影音</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-orange-900 mb-3">💾 便捷匯出</h3>
          <ul className="space-y-2 text-orange-800 text-sm">
            <li>• CSV 批次上架格式</li>
            <li>• 圖片 ZIP 打包下載</li>
            <li>• 拍攝清單文字檔</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // 渲染當前頁面
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHome();
      case 'copywriting':
        return <CopywritingGenerator />;
      case 'image':
        return <ImageGenerator />;
      case 'video':
        return <VideoScriptGenerator />;
      case 'platform':
        return <PlatformConverter />;
      case 'fbad':
        return <FBAdGenerator />;
      case 'audience':
        return <AudienceAnalyzer />;
      default:
        return renderHome();
    }
  };

  return (
    <div>
      {/* 頂部導航 */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 overflow-x-auto py-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? `bg-${tab.color}-100 text-${tab.color}-700 font-medium`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* 底部資訊 */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>電商行銷自動化系統 - 運用 AI 技術提升行銷效率</p>
          <p className="mt-2 text-xs text-gray-500">
            支援 GPT-4、Claude 等商業 AI 模型
          </p>
        </div>
      </footer>
    </div>
  );
}
