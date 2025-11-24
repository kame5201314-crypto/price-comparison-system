// AI 行銷服務 - 整合 OpenAI 或其他 AI 服務

import {
  ProductInfo,
  CopywritingType,
  GeneratedCopy,
  ImageGenerationOptions,
  GeneratedImage,
  VideoScript,
  VideoStyle,
  Platform,
  PlatformContent,
  FBAdCreative,
  AudienceAnalysis,
  SceneScript
} from '../types/marketing';

// 優先使用 OpenRouter（支援多種模型），其次使用 OpenAI
import {
  analyzeProductFromUrl as analyzeWithOpenRouter,
  generateProductCopy as generateWithOpenRouter,
  analyzeAudience as analyzeAudienceWithOpenRouter
} from './openrouterService';

import {
  analyzeProductFromUrl as analyzeWithOpenAI,
  generateProductCopy as generateWithOpenAI,
  analyzeAudience as analyzeAudienceWithOpenAI
} from './openaiService';

// 檢查 API Key
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

// 優先使用 OpenRouter
const USE_OPENROUTER = !!OPENROUTER_API_KEY;
const USE_OPENAI = !!OPENAI_API_KEY;
const USE_REAL_AI = USE_OPENROUTER || USE_OPENAI;

// 診斷日誌
console.log('🔧 環境變數檢查:');
console.log('  OPENROUTER_API_KEY:', OPENROUTER_API_KEY ? '已設定 ✓' : '未設定 ✗');
console.log('  OPENAI_API_KEY:', OPENAI_API_KEY ? `已設定 ✓ (${OPENAI_API_KEY.substring(0, 20)}...)` : '未設定 ✗');
console.log('  USE_OPENROUTER:', USE_OPENROUTER);
console.log('  USE_OPENAI:', USE_OPENAI);
console.log('  USE_REAL_AI:', USE_REAL_AI);

// 選擇使用的服務
const aiService = USE_OPENROUTER ? {
  analyzeProductFromUrl: analyzeWithOpenRouter,
  generateProductCopy: generateWithOpenRouter,
  analyzeAudience: analyzeAudienceWithOpenRouter,
  name: 'OpenRouter'
} : {
  analyzeProductFromUrl: analyzeWithOpenAI,
  generateProductCopy: generateWithOpenAI,
  analyzeAudience: analyzeAudienceWithOpenAI,
  name: 'OpenAI'
};

/**
 * ① AI 商品文案自動生成
 */
export class CopywritingService {

  /**
   * 分析商品網址
   */
  static async analyzeProductUrl(url: string): Promise<Partial<ProductInfo>> {
    try {
      if (USE_REAL_AI) {
        // 使用真實 AI 分析
        console.log(`🤖 使用 ${aiService.name} 分析網址:`, url);
        const result = await aiService.analyzeProductFromUrl(url);
        console.log('✅ AI 分析完成:', result);
        return result;
      } else {
        // 使用模擬資料
        console.log('⚠️ 未設定 API Key，使用模擬資料');
        await new Promise(resolve => setTimeout(resolve, 1500));

        return {
          name: '智能藍牙自拍棒',
          description: '可伸縮、支援 360 度旋轉',
          category: '3C配件',
          attributes: {
            color: ['黑色', '白色', '粉色'],
            material: '鋁合金',
            usage: ['自拍', '旅遊', '直播']
          }
        };
      }
    } catch (error) {
      console.error('網址分析失敗:', error);
      // 失敗時回退到模擬資料
      console.log('⚠️ AI 分析失敗，使用模擬資料');
      return {
        name: '商品名稱（請手動修改）',
        description: '商品描述',
        category: '未分類'
      };
    }
  }

  /**
   * 生成商品文案
   */
  static async generateCopy(
    product: ProductInfo,
    type: CopywritingType
  ): Promise<GeneratedCopy> {
    try {
      let copies;

      if (USE_REAL_AI) {
        // 使用真實 AI 生成
        console.log(`🤖 使用 ${aiService.name} 生成 ${type} 文案:`, product.name);
        const result = await aiService.generateProductCopy(
          product.name,
          product.description || '',
          type
        );
        console.log('✅ AI 文案生成完成');
        copies = result;
      } else {
        // 使用模擬資料
        console.log(`⚠️ 未設定 API Key，使用模擬 ${type} 文案`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        copies = this.getMockCopy(product, type);
      }

      return {
        id: `copy_${Date.now()}`,
        productId: product.id,
        type,
        title: copies.title,
        content: copies.content,
        keywords: copies.keywords,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('文案生成失敗:', error);
      // 失敗時回退到模擬資料
      console.log('⚠️ AI 生成失敗，使用模擬資料');
      const copies = this.getMockCopy(product, type);
      return {
        id: `copy_${Date.now()}`,
        productId: product.id,
        type,
        title: copies.title,
        content: copies.content,
        keywords: copies.keywords,
        createdAt: new Date()
      };
    }
  }

  /**
   * 批次生成多種文案
   */
  static async generateMultipleCopies(
    product: ProductInfo,
    types: CopywritingType[]
  ): Promise<GeneratedCopy[]> {
    const promises = types.map(type => this.generateCopy(product, type));
    return Promise.all(promises);
  }

  /**
   * 模擬文案資料
   */
  private static getMockCopy(product: ProductInfo, type: CopywritingType) {
    const copies: Record<CopywritingType, any> = {
      [CopywritingType.SEO]: {
        title: `【2024最新】${product.name} | 專業級自拍神器 | 藍牙遙控 | 台灣現貨`,
        content: `${product.name}是您旅遊自拍的最佳選擇！採用航太級鋁合金材質，輕巧便攜卻堅固耐用。內建藍牙 5.0 遙控器，10 公尺遠距離操控，支援 iOS 與 Android 雙系統。360 度旋轉球型雲台，讓您輕鬆捕捉每個完美角度。可伸縮設計 20-100cm，滿足各種拍攝需求。適合旅遊、聚會、直播、Vlog 拍攝。`,
        keywords: ['自拍棒', '藍牙自拍棒', '旅遊必備', '直播器材', 'vlog設備']
      },
      [CopywritingType.ECOMMERCE]: {
        title: `限時特價！專業級藍牙自拍棒 - 旅遊/直播必備`,
        content: `
🔥 限時優惠中！原價 $990，現在只要 $599！

✨ 五大特色：
• 藍牙 5.0 遙控，10 公尺遠距操控
• 360° 旋轉雲台，任意角度隨心拍
• 20-100cm 可伸縮，適應各種場景
• 航太級鋁合金，輕巧堅固
• 支援 iOS/Android 雙系統

📦 包裝內容：
✓ 自拍棒主體 x1
✓ 藍牙遙控器 x1
✓ USB 充電線 x1
✓ 手提收納袋 x1

🚚 台灣現貨，24 小時快速出貨
🛡️ 一年保固，七天鑑賞期

立即下單，開始您的精彩拍攝之旅！
        `,
        keywords: ['限時特價', '現貨', '快速出貨']
      },
      [CopywritingType.EMOTIONAL]: {
        title: `記錄每個美好瞬間，從擁有它開始`,
        content: `
還記得上次旅行，想拍全景照卻找不到路人幫忙的尷尬嗎？
還記得和朋友聚會，總有人要當攝影師無法入鏡的遺憾嗎？

有了這支智能自拍棒，每個珍貴時刻都不再錯過。

晨曦中的海邊，只有你和浪花。輕按遙控器，定格這份寧靜。
夕陽下的山頂，朋友們的笑容。伸長自拍棒，把整片天空都收進照片。

它不只是一支自拍棒，
它是你的專屬攝影師，
是旅途中最可靠的夥伴，
是幫你記錄生活每個美好瞬間的魔法棒。

因為人生只有一次，每個瞬間都值得被完美保存。
        `,
        keywords: ['旅行回憶', '美好時光', '珍貴瞬間']
      },
      [CopywritingType.SHORT_TITLE]: {
        title: `藍牙自拍棒｜遠距遙控｜360°旋轉｜旅遊必備`,
        content: `專業級自拍神器，輕鬆拍出完美照片`,
        keywords: ['簡短', '精準']
      },
      [CopywritingType.SHOPEE_SPEC]: {
        title: `【現貨】專業藍牙自拍棒 遙控伸縮 360度旋轉 輕巧便攜`,
        content: `
【商品規格】
・材質：航太級鋁合金
・顏色：黑色/白色/粉色
・伸縮範圍：20-100cm
・重量：180g
・連接方式：藍牙 5.0
・遙控距離：10 公尺
・電池：CR2032（遙控器）
・兼容系統：iOS 5.0+ / Android 4.3+
・保固：一年

【商品賣點】
✓ 藍牙遙控，解放雙手
✓ 360° 球型雲台，任意角度
✓ 輕巧便攜，僅 180g
✓ 穩固夾持，支援大螢幕手機
✓ 防滑手柄，握感舒適
✓ 台灣現貨，快速出貨
        `,
        keywords: ['規格', '賣點', '蝦皮格式']
      },
      [CopywritingType.SHOPEE_TITLE]: {
        title: `【現貨免運】${product.name} 藍牙遙控 360度旋轉 伸縮自拍棒 旅遊必備`,
        content: `蝦皮標題建議（60字以內）：
• 【現貨免運】${product.name} 藍牙遙控 360度旋轉
• 【熱銷】專業自拍棒 藍牙遙控 伸縮設計 輕便攜帶
• 【台灣現貨】智能自拍棒｜藍牙5.0｜360度旋轉雲台
• 【限時特價】專業級自拍棒 遠距遙控 旅遊直播必備`,
        keywords: ['蝦皮標題', '60字', '關鍵字']
      },
      [CopywritingType.PRODUCT_SPEC]: {
        title: `${product.name} - 商品規格表`,
        content: `【商品規格】
・品名：${product.name}
・材質：航太級鋁合金 + ABS 工程塑膠
・顏色：黑色 / 白色 / 粉色 / 藍色
・尺寸：收合 20cm / 展開 100cm
・重量：約 180g
・連接方式：藍牙 5.0
・遙控距離：約 10 公尺
・電池規格：CR2032 鈕扣電池（遙控器）
・兼容系統：iOS 5.0+ / Android 4.3+
・適用手機寬度：5.5-9.5cm
・雲台角度：360° 水平旋轉 + 180° 垂直調整
・產地：台灣設計 / 中國製造
・保固：一年保固`,
        keywords: ['規格', '尺寸', '材質']
      },
      [CopywritingType.PRODUCT_FEATURES]: {
        title: `${product.name} - 商品特色`,
        content: `【商品特色 / 賣點】
🌟 五大核心特色：
1️⃣ 藍牙 5.0 智能遙控
   ・10 公尺遠距操控，輕按即拍
   ・支援 iOS / Android 雙系統
   ・免 App，開機即連

2️⃣ 360° 全方位雲台
   ・水平 360° + 垂直 180° 自由調整
   ・球型雲台設計，任意角度定格

3️⃣ 伸縮便攜設計
   ・20-100cm 五段伸縮
   ・收合僅 20cm，放入包包不佔空間

4️⃣ 航太級鋁合金材質
   ・輕量化設計僅 180g
   ・堅固耐用不易彎折

5️⃣ 穩固手機夾持
   ・5.5-9.5cm 寬度適用
   ・防滑矽膠墊，保護手機`,
        keywords: ['特色', '賣點', '優勢']
      },
      [CopywritingType.PRODUCT_OPTIONS]: {
        title: `${product.name} - 商品選項`,
        content: `【商品選項】

📦 顏色選項：
・經典黑 - 穩重大方，百搭首選
・珍珠白 - 簡約時尚，清新質感
・櫻花粉 - 甜美可愛，女生最愛
・天空藍 - 活力清新，年輕活潑

📐 規格選項：
・標準版 - 自拍棒 + 遙控器
・豪華版 - 自拍棒 + 遙控器 + 三腳架
・旗艦版 - 自拍棒 + 遙控器 + 三腳架 + 補光燈

🎁 加購選項：
・替換遙控器電池 x2 (+$30)
・絨布收納袋 (+$50)
・手機廣角鏡頭 (+$199)`,
        keywords: ['選項', '顏色', '規格']
      }
    };

    return copies[type];
  }

  /**
   * 將文案轉為 CSV 格式（用於批次上架）
   */
  static exportToCsv(copies: GeneratedCopy[]): string {
    const headers = ['商品名稱', '文案類型', '標題', '內容', '關鍵字'];
    const rows = copies.map(copy => [
      copy.productId || '',
      copy.type,
      copy.title,
      copy.content.replace(/\n/g, ' '),
      copy.keywords?.join(', ') || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }
}

/**
 * ② AI 批次產圖服務
 */
export class ImageGenerationService {

  /**
   * 生成產品圖片
   */
  static async generateImages(
    options: ImageGenerationOptions
  ): Promise<GeneratedImage[]> {
    try {
      // 實際應用：呼叫 DALL-E 或 Midjourney API
      await new Promise(resolve => setTimeout(resolve, 3000));

      const images: GeneratedImage[] = [];
      for (let i = 0; i < options.count; i++) {
        images.push({
          id: `img_${Date.now()}_${i}`,
          url: `https://picsum.photos/1200/1200?random=${Date.now() + i}`,
          thumbnail: `https://picsum.photos/300/300?random=${Date.now() + i}`,
          style: options.style,
          background: options.background,
          createdAt: new Date()
        });
      }

      return images;
    } catch (error) {
      console.error('圖片生成失敗:', error);
      throw error;
    }
  }

  /**
   * 移除背景
   */
  static async removeBackground(imageUrl: string): Promise<string> {
    // 實際應用：呼叫 remove.bg API
    await new Promise(resolve => setTimeout(resolve, 1500));
    return imageUrl; // 回傳去背後的圖片 URL
  }

  /**
   * 批次下載為 ZIP
   */
  static async downloadAsZip(images: GeneratedImage[]): Promise<Blob> {
    // 實際應用：使用 JSZip 打包
    await new Promise(resolve => setTimeout(resolve, 1000));
    return new Blob(['mock zip content'], { type: 'application/zip' });
  }
}

/**
 * ③ 影片腳本生成服務
 */
export class VideoScriptService {

  /**
   * 生成影片腳本
   */
  static async generateScript(
    product: ProductInfo,
    style: VideoStyle,
    duration: number = 15
  ): Promise<VideoScript> {
    try {
      // 實際應用：呼叫 AI API 生成腳本
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockScripts = this.getMockScript(product, style);

      return {
        id: `script_${Date.now()}`,
        productId: product.id,
        style,
        duration,
        script: mockScripts.script,
        scenes: mockScripts.scenes,
        transitions: mockScripts.transitions,
        cameraAngles: mockScripts.cameraAngles,
        musicStyle: mockScripts.musicStyle,
        cta: mockScripts.cta,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('腳本生成失敗:', error);
      throw error;
    }
  }

  /**
   * 模擬腳本資料
   */
  private static getMockScript(product: ProductInfo, style: VideoStyle) {
    const scripts: Record<VideoStyle, any> = {
      [VideoStyle.SALES_TALK]: {
        script: '嗨大家好！今天要來介紹這個超好用的自拍棒...',
        scenes: [
          {
            sceneNumber: 1,
            duration: 3,
            description: '開場畫面 - 主持人手持產品',
            voiceover: '嗨大家好！今天要來介紹這個超好用的自拍棒',
            cameraAngle: '正面中景',
            props: ['自拍棒']
          },
          {
            sceneNumber: 2,
            duration: 4,
            description: '功能展示 - 伸縮示範',
            voiceover: '它可以從 20 公分伸長到 100 公分，超方便的！',
            cameraAngle: '特寫',
            props: ['自拍棒']
          },
          {
            sceneNumber: 3,
            duration: 4,
            description: '使用情境 - 自拍示範',
            voiceover: '藍牙遙控，輕鬆就能拍出完美照片',
            cameraAngle: '側面全景',
            props: ['自拍棒', '手機']
          },
          {
            sceneNumber: 4,
            duration: 4,
            description: '結尾 CTA',
            voiceover: '限時優惠中！點擊連結立即購買',
            cameraAngle: '正面特寫',
            props: ['產品包裝']
          }
        ],
        transitions: ['淡入', '快切', '推進', '淡出'],
        cameraAngles: ['正面中景', '特寫', '側面全景', '正面特寫'],
        musicStyle: '輕快活潑的背景音樂',
        cta: '立即購買，享限時折扣！'
      },
      [VideoStyle.PRODUCT_DISPLAY]: {
        script: '商品 360 度展示，配合文字說明',
        scenes: [
          {
            sceneNumber: 1,
            duration: 3,
            description: '產品正面特寫',
            voiceover: '',
            cameraAngle: '正面特寫',
            props: ['自拍棒']
          },
          {
            sceneNumber: 2,
            duration: 3,
            description: '360 度旋轉展示',
            voiceover: '',
            cameraAngle: '環繞拍攝',
            props: ['自拍棒']
          },
          {
            sceneNumber: 3,
            duration: 3,
            description: '細節展示',
            voiceover: '',
            cameraAngle: '微距特寫',
            props: ['自拍棒細節']
          },
          {
            sceneNumber: 4,
            duration: 3,
            description: '包裝展示',
            voiceover: '',
            cameraAngle: '俯視',
            props: ['產品包裝']
          },
          {
            sceneNumber: 5,
            duration: 3,
            description: 'CTA 畫面',
            voiceover: '',
            cameraAngle: '正面',
            props: ['產品 + 文字']
          }
        ],
        transitions: ['溶接', '推拉', '旋轉', '縮放', '淡出'],
        cameraAngles: ['正面特寫', '環繞', '微距', '俯視', '正面'],
        musicStyle: '優雅的器樂背景音樂',
        cta: '立即選購'
      },
      [VideoStyle.STORY_TELLING]: {
        script: '用故事呈現產品如何改善生活',
        scenes: [
          {
            sceneNumber: 1,
            duration: 3,
            description: '問題場景 - 拍照困擾',
            voiceover: '旅行時總是拍不到全景？',
            cameraAngle: '主觀視角',
            props: ['場景道具']
          },
          {
            sceneNumber: 2,
            duration: 3,
            description: '解決方案出現',
            voiceover: '有了它，問題迎刃而解',
            cameraAngle: '產品特寫',
            props: ['自拍棒']
          },
          {
            sceneNumber: 3,
            duration: 4,
            description: '使用情境 - 美好時光',
            voiceover: '輕鬆記錄每個美好瞬間',
            cameraAngle: '情境全景',
            props: ['人物', '自拍棒', '場景']
          },
          {
            sceneNumber: 4,
            duration: 3,
            description: '成果展示',
            voiceover: '完美的照片，珍貴的回憶',
            cameraAngle: '照片特寫',
            props: ['照片成果']
          },
          {
            sceneNumber: 5,
            duration: 2,
            description: 'CTA',
            voiceover: '現在就開始你的拍攝之旅',
            cameraAngle: '產品 + 文字',
            props: ['產品', 'CTA 文字']
          }
        ],
        transitions: ['淡入', '溶接', '快切', '慢動作', '淡出'],
        cameraAngles: ['主觀視角', '特寫', '全景', '照片特寫', '產品特寫'],
        musicStyle: '溫暖感人的配樂',
        cta: '限時優惠，立即擁有'
      }
    };

    return scripts[style];
  }

  /**
   * 匯出拍攝清單
   */
  static exportShootingList(script: VideoScript): string {
    let output = `【${script.style} 拍攝清單】\n\n`;
    output += `總時長：${script.duration} 秒\n`;
    output += `音樂風格：${script.musicStyle}\n\n`;

    output += `【分鏡表】\n`;
    script.scenes.forEach(scene => {
      output += `\n場景 ${scene.sceneNumber} (${scene.duration}秒)\n`;
      output += `畫面：${scene.description}\n`;
      output += `鏡位：${scene.cameraAngle}\n`;
      if (scene.voiceover) {
        output += `旁白：${scene.voiceover}\n`;
      }
      if (scene.props && scene.props.length > 0) {
        output += `道具：${scene.props.join(', ')}\n`;
      }
    });

    output += `\n【轉場效果】\n`;
    script.transitions.forEach((transition, i) => {
      output += `場景 ${i + 1} → 場景 ${i + 2}: ${transition}\n`;
    });

    output += `\n【CTA 文案】\n${script.cta}\n`;

    return output;
  }
}

/**
 * ④ 平台格式轉換服務
 */
export class PlatformConversionService {

  /**
   * 轉換為平台格式
   */
  static async convertToPlatform(
    product: ProductInfo,
    copy: GeneratedCopy,
    platform: Platform
  ): Promise<PlatformContent> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const formatRules = this.getPlatformRules(platform);

      // 根據平台規則調整內容
      let title = copy.title.substring(0, formatRules.titleMaxLength);
      let description = copy.content;

      if (platform === Platform.SHOPEE) {
        return this.convertToShopee(product, title, description);
      } else if (platform === Platform.MOMO) {
        return this.convertToMomo(product, title, description);
      }

      return {
        platform,
        title,
        description,
        images: product.images
      };
    } catch (error) {
      console.error('平台轉換失敗:', error);
      throw error;
    }
  }

  /**
   * 取得平台規則
   */
  private static getPlatformRules(platform: Platform) {
    const rules = {
      [Platform.SHOPEE]: {
        titleMaxLength: 60,
        imageSize: { width: 1200, height: 1200 }
      },
      [Platform.MOMO]: {
        titleMaxLength: 50,
        imageSize: { width: 800, height: 800 }
      },
      [Platform.PCHOME]: {
        titleMaxLength: 45,
        imageSize: { width: 1000, height: 1000 }
      },
      [Platform.FACEBOOK]: {
        titleMaxLength: 40,
        imageSize: { width: 1200, height: 630 }
      },
      [Platform.INSTAGRAM]: {
        titleMaxLength: 30,
        imageSize: { width: 1080, height: 1080 }
      }
    };

    return rules[platform];
  }

  /**
   * 轉換為蝦皮格式
   */
  private static convertToShopee(
    product: ProductInfo,
    title: string,
    description: string
  ): PlatformContent {
    const specifications = [
      `品名：${product.name}`,
      `材質：${product.attributes?.material || '優質材料'}`,
      `顏色：${product.attributes?.color?.join('、') || '多色可選'}`,
      `產地：台灣`,
      `保固：一年保固`
    ];

    const sellingPoints = [
      '✓ 台灣現貨，快速出貨',
      '✓ 品質保證，安心購買',
      '✓ 專業客服，售後無憂',
      '✓ 七天鑑賞期',
      '✓ 滿額免運'
    ];

    // 生成 CSV
    const csvData = this.generateShopeeCsv({
      title,
      description,
      specifications,
      sellingPoints,
      price: product.price || 0,
      stock: 100
    });

    return {
      platform: Platform.SHOPEE,
      title,
      description,
      specifications,
      sellingPoints,
      images: product.images,
      csvData
    };
  }

  /**
   * 轉換為 Momo 格式
   */
  private static convertToMomo(
    product: ProductInfo,
    title: string,
    description: string
  ): PlatformContent {
    // Momo 需要分段式描述
    const formattedDescription = this.formatMomoDescription(description);

    const specifications = [
      `商品名稱｜${product.name}`,
      `商品材質｜${product.attributes?.material || '優質材料'}`,
      `商品顏色｜${product.attributes?.color?.join('、') || '多色'}`,
      `保固期限｜一年`,
      `產地｜台灣`
    ];

    return {
      platform: Platform.MOMO,
      title,
      description: formattedDescription,
      specifications,
      images: product.images
    };
  }

  /**
   * 格式化 Momo 描述（需要分段）
   */
  private static formatMomoDescription(description: string): string {
    const sections = description.split('\n\n');
    return sections
      .map((section, index) => `【段落 ${index + 1}】\n${section}`)
      .join('\n\n');
  }

  /**
   * 生成蝦皮 CSV
   */
  private static generateShopeeCsv(data: any): string {
    const headers = [
      '商品名稱',
      '商品描述',
      '規格',
      '賣點',
      '價格',
      '庫存',
      '圖片1',
      '圖片2',
      '圖片3'
    ];

    const row = [
      data.title,
      data.description,
      data.specifications.join(' | '),
      data.sellingPoints.join(' | '),
      data.price,
      data.stock,
      '', '', '' // 圖片網址
    ];

    return [
      headers.join(','),
      row.map(cell => `"${cell}"`).join(',')
    ].join('\n');
  }
}

/**
 * ⑤ FB 廣告素材生成服務
 */
export class FBAdService {

  /**
   * 生成 FB 廣告素材
   */
  static async generateAds(
    product: ProductInfo,
    count: number = 5
  ): Promise<FBAdCreative[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const ads: FBAdCreative[] = [];

      for (let i = 0; i < count; i++) {
        ads.push(this.generateSingleAd(product, i));
      }

      return ads;
    } catch (error) {
      console.error('FB 廣告生成失敗:', error);
      throw error;
    }
  }

  /**
   * 生成單一廣告
   */
  private static generateSingleAd(product: ProductInfo, index: number): FBAdCreative {
    const templates = [
      {
        headline: `限時特價！${product.name}`,
        primaryText: `🔥 超值優惠來了！${product.name}限時特價中！\n\n✨ 為什麼選擇我們？\n• 品質保證\n• 快速出貨\n• 售後服務完善\n\n立即下單，把握優惠！`,
        description: '限時優惠，數量有限',
        callToAction: '立即購買'
      },
      {
        headline: `${product.name} - 你的最佳選擇`,
        primaryText: `還在猶豫嗎？千萬別錯過這個改變生活的好物！\n\n${product.description}\n\n💝 現在下單還送精美贈品\n📦 全台配送，快速到貨\n🛡️ 品質保證，安心購買`,
        description: '品質保證，值得信賴',
        callToAction: '了解更多'
      },
      {
        headline: `熱銷商品 - ${product.name}`,
        primaryText: `🌟 為什麼大家都在買？\n\n因為它真的太好用了！\n已經有超過 10,000 位顧客給予五星好評\n\n現在加入，你也能享受這份美好！`,
        description: '萬人好評推薦',
        callToAction: '立即選購'
      },
      {
        headline: `新品上市 | ${product.name}`,
        primaryText: `🎉 重磅新品登場！\n\n${product.name}正式上市\n早鳥優惠限時開跑\n\n✓ 限量供應\n✓ 首批加贈好禮\n✓ 滿額再享折扣\n\n手刀搶購，慢了就沒了！`,
        description: '新品首發，限量優惠',
        callToAction: '搶先購買'
      },
      {
        headline: `${product.name} | 限時優惠中`,
        primaryText: `💰 省錢攻略來了！\n\n原價 $${(product.price || 990) + 400}，現在只要 $${product.price || 990}！\n現省 $400，超划算！\n\n🎁 加碼優惠：\n• 買二送一\n• 滿千免運\n• 會員再享折扣\n\n優惠倒數中，把握機會！`,
        description: '超值優惠，立即搶購',
        callToAction: '馬上買'
      }
    ];

    const template = templates[index % templates.length];

    return {
      id: `fb_ad_${Date.now()}_${index}`,
      productId: product.id,
      headline: template.headline,
      primaryText: template.primaryText,
      description: template.description,
      image: product.images?.[0],
      callToAction: template.callToAction,
      createdAt: new Date()
    };
  }

  /**
   * 驗證 FB 廣告規格
   */
  static validateAdFormat(ad: FBAdCreative): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // FB 廣告規格限制
    if (ad.headline.length > 40) {
      errors.push('標題不可超過 40 字');
    }

    if (ad.primaryText.length > 125) {
      errors.push('主要文字建議不超過 125 字（顯示完整）');
    }

    if (ad.description.length > 30) {
      errors.push('說明不可超過 30 字');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

/**
 * ⑥ 受眾分析服務
 */
export class AudienceAnalysisService {

  /**
   * 分析產品受眾
   */
  static async analyzeAudience(product: ProductInfo): Promise<AudienceAnalysis> {
    try {
      if (USE_REAL_AI) {
        // 使用真實 AI 分析
        console.log(`🤖 使用 ${aiService.name} 分析受眾:`, product.name);
        const result = await aiService.analyzeAudience(
          product.name,
          product.description || ''
        );
        console.log('✅ AI 受眾分析完成');
        return result;
      } else {
        // 使用模擬資料
        console.log('⚠️ 未設定 API Key，使用模擬受眾分析');
        await new Promise(resolve => setTimeout(resolve, 1500));
        return this.getMockAudienceAnalysis(product);
      }
    } catch (error) {
      console.error('受眾分析失敗:', error);
      // 失敗時回退到模擬資料
      console.log('⚠️ AI 分析失敗，使用模擬資料');
      return this.getMockAudienceAnalysis(product);
    }
  }

  /**
   * 模擬受眾分析
   */
  private static getMockAudienceAnalysis(product: ProductInfo): AudienceAnalysis {
    // 根據產品類型返回不同的受眾分析
    const productName = product.name.toLowerCase();

    if (productName.includes('自拍') || productName.includes('相機')) {
      return {
        productName: product.name,
        suggestedAudiences: [
          {
            name: '旅遊愛好者',
            description: '經常旅行、喜歡記錄旅程的人群',
            size: 'large',
            relevanceScore: 95,
            suggestedPlatforms: [Platform.INSTAGRAM, Platform.FACEBOOK]
          },
          {
            name: '社群內容創作者',
            description: 'YouTuber、部落客、IG 網紅',
            size: 'medium',
            relevanceScore: 90,
            suggestedPlatforms: [Platform.INSTAGRAM, Platform.FACEBOOK]
          },
          {
            name: '攝影愛好者',
            description: '喜歡拍照、對攝影器材有興趣',
            size: 'medium',
            relevanceScore: 85,
            suggestedPlatforms: [Platform.FACEBOOK, Platform.INSTAGRAM]
          },
          {
            name: '年輕女性族群',
            description: '18-35 歲女性，喜歡自拍、分享生活',
            size: 'large',
            relevanceScore: 88,
            suggestedPlatforms: [Platform.INSTAGRAM, Platform.SHOPEE]
          },
          {
            name: '直播主',
            description: '需要穩定拍攝設備的直播工作者',
            size: 'small',
            relevanceScore: 80,
            suggestedPlatforms: [Platform.FACEBOOK, Platform.SHOPEE]
          }
        ],
        demographics: {
          ageRange: ['18-24', '25-34', '35-44'],
          gender: ['女性 65%', '男性 35%'],
          interests: [
            '旅遊',
            '攝影',
            '社群媒體',
            '時尚',
            '美食',
            'Vlog',
            '生活風格'
          ],
          behaviors: [
            '頻繁使用 Instagram',
            '經常線上購物',
            '喜歡分享照片',
            '關注 KOL/網紅',
            '參與社群互動'
          ]
        },
        keywords: [
          '自拍',
          '旅遊',
          '攝影',
          'vlog',
          '網美',
          '打卡',
          'IG',
          '直播',
          '社群',
          '記錄生活'
        ],
        targetMarkets: [
          '台灣',
          '香港',
          '新加坡',
          '馬來西亞'
        ]
      };
    }

    // 預設分析
    return {
      productName: product.name,
      suggestedAudiences: [
        {
          name: '一般消費者',
          description: '對該產品有興趣的一般大眾',
          size: 'large',
          relevanceScore: 70,
          suggestedPlatforms: [Platform.FACEBOOK, Platform.SHOPEE]
        }
      ],
      demographics: {
        ageRange: ['18-65'],
        gender: ['不限'],
        interests: ['生活用品', '線上購物'],
        behaviors: ['線上購物']
      },
      keywords: [product.name],
      targetMarkets: ['台灣']
    };
  }

  /**
   * 根據網址分析受眾
   */
  static async analyzeAudienceByUrl(url: string): Promise<AudienceAnalysis> {
    // 先分析網址取得產品資訊
    const productInfo = await CopywritingService.analyzeProductUrl(url);

    // 再分析受眾
    return this.analyzeAudience(productInfo as ProductInfo);
  }
}

export default {
  CopywritingService,
  ImageGenerationService,
  VideoScriptService,
  PlatformConversionService,
  FBAdService,
  AudienceAnalysisService
};
