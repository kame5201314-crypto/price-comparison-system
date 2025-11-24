// 電商行銷自動化系統 - 型別定義

// 商品資訊
export interface ProductInfo {
  id?: string;
  name: string;
  url?: string;
  description?: string;
  category?: string;
  price?: number;
  images?: string[];
  attributes?: {
    color?: string[];
    size?: string[];
    material?: string;
    usage?: string[];
  };
}

// 文案類型
export enum CopywritingType {
  SEO = 'seo',
  ECOMMERCE = 'ecommerce',
  EMOTIONAL = 'emotional',
  SHORT_TITLE = 'short_title',
  SHOPEE_SPEC = 'shopee_spec',
  SHOPEE_TITLE = 'shopee_title',       // 蝦皮標題（60字以內）
  PRODUCT_SPEC = 'product_spec',        // 商品規格
  PRODUCT_FEATURES = 'product_features', // 商品特色/賣點
  PRODUCT_OPTIONS = 'product_options'   // 商品選項（顏色/尺寸等）
}

// 生成的文案
export interface GeneratedCopy {
  id: string;
  productId?: string;
  type: CopywritingType;
  title: string;
  content: string;
  keywords?: string[];
  createdAt: Date;
  template?: string;
}

// 文案模板
export interface CopyTemplate {
  id: string;
  name: string;
  type: CopywritingType;
  content: string;
  variables: string[];
}

// 圖片生成風格
export enum ImageStyle {
  IG_STYLE = 'ig_style',
  FRESH_GIRL = 'fresh_girl',
  TECH_MALE = 'tech_male',
  JAPAN_MINIMAL = 'japan_minimal'
}

// 背景類型
export enum BackgroundType {
  WHITE = 'white',
  WOOD_TABLE = 'wood_table',
  MARBLE = 'marble',
  KITCHEN = 'kitchen',
  OUTDOOR = 'outdoor',
  BATHROOM = 'bathroom'
}

// 圖片生成選項
export interface ImageGenerationOptions {
  productImage: string;
  style: ImageStyle;
  background: BackgroundType;
  addLogo?: boolean;
  logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  count: number; // 3-20
  removeBackground?: boolean;
}

// 生成的圖片
export interface GeneratedImage {
  id: string;
  url: string;
  thumbnail: string;
  style: ImageStyle;
  background: BackgroundType;
  createdAt: Date;
}

// 影片風格
export enum VideoStyle {
  SALES_TALK = 'sales_talk',
  PRODUCT_DISPLAY = 'product_display',
  STORY_TELLING = 'story_telling'
}

// 影片腳本
export interface VideoScript {
  id: string;
  productId?: string;
  style: VideoStyle;
  duration: number; // 秒
  script: string;
  scenes: SceneScript[];
  transitions: string[];
  cameraAngles: string[];
  musicStyle: string;
  cta: string;
  createdAt: Date;
}

// 分鏡腳本
export interface SceneScript {
  sceneNumber: number;
  duration: number;
  description: string;
  voiceover: string;
  cameraAngle: string;
  props?: string[];
}

// 電商平台
export enum Platform {
  SHOPEE = 'shopee',
  MOMO = 'momo',
  PCHOME = 'pchome',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram'
}

// 平台格式規則
export interface PlatformFormat {
  platform: Platform;
  titleMaxLength: number;
  descriptionFormat?: string;
  imageSize?: {
    width: number;
    height: number;
  };
  requiredFields?: string[];
}

// 轉換後的平台內容
export interface PlatformContent {
  platform: Platform;
  title: string;
  description: string;
  specifications?: string[];
  sellingPoints?: string[];
  images?: string[];
  csvData?: string;
}

// FB 廣告素材
export interface FBAdCreative {
  id: string;
  productId?: string;
  headline: string;
  primaryText: string;
  description: string;
  image?: string;
  callToAction: string;
  createdAt: Date;
}

// 受眾分析結果
export interface AudienceAnalysis {
  productName: string;
  suggestedAudiences: AudienceSegment[];
  demographics: {
    ageRange: string[];
    gender: string[];
    interests: string[];
    behaviors: string[];
  };
  keywords: string[];
  targetMarkets: string[];
}

// 受眾群體
export interface AudienceSegment {
  name: string;
  description: string;
  size: 'small' | 'medium' | 'large';
  relevanceScore: number; // 0-100
  suggestedPlatforms: Platform[];
}

// AI 生成請求
export interface AIGenerationRequest {
  productInfo: ProductInfo;
  type: 'copy' | 'image' | 'video' | 'platform' | 'fb_ad' | 'audience';
  options?: any;
}

// AI 生成回應
export interface AIGenerationResponse {
  success: boolean;
  data?: any;
  error?: string;
  tokensUsed?: number;
}
