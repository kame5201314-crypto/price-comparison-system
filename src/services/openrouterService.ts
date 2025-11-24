// OpenRouter API 整合服務 - 支援多種 AI 模型

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// 可用的模型列表（按價格排序，從便宜到貴）
export const AVAILABLE_MODELS = {
  // 免費模型
  FREE: {
    id: 'google/gemini-flash-1.5',
    name: 'Gemini Flash 1.5',
    price: '免費',
    speed: '極快'
  },
  // 便宜模型
  CHEAP: {
    id: 'meta-llama/llama-3.1-8b-instruct:free',
    name: 'Llama 3.1 8B',
    price: '免費',
    speed: '快'
  },
  // 中等模型（推薦）
  RECOMMENDED: {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro 1.5',
    price: '$0.00125/1K tokens',
    speed: '快'
  },
  GPT35: {
    id: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    price: '$0.002/1K tokens',
    speed: '快'
  },
  // 高品質模型
  CLAUDE: {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    price: '$0.00025/1K tokens',
    speed: '快'
  },
  GPT4: {
    id: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo',
    price: '$0.01/1K tokens',
    speed: '中'
  },
  // 最佳品質
  CLAUDE_SONNET: {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    price: '$0.003/1K tokens',
    speed: '中'
  }
};

// 預設使用的模型（可在 .env 中設定）
const DEFAULT_MODEL = import.meta.env.VITE_AI_MODEL || AVAILABLE_MODELS.FREE.id;

/**
 * 呼叫 OpenRouter API
 */
export async function callOpenRouter(
  prompt: string,
  systemMessage: string = '你是一位專業的電商行銷文案撰寫專家。',
  model: string = DEFAULT_MODEL
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    console.warn('⚠️ 未設定 OPENROUTER_API_KEY，使用模擬資料');
    throw new Error('未設定 API Key');
  }

  try {
    console.log(`🤖 使用模型: ${model}`);

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'E-commerce Marketing AI'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenRouter API 錯誤: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // 記錄使用量
    if (data.usage) {
      console.log(`💰 Token 使用: ${data.usage.total_tokens} (輸入: ${data.usage.prompt_tokens}, 輸出: ${data.usage.completion_tokens})`);
    }

    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenRouter API 呼叫失敗:', error);
    throw error;
  }
}

/**
 * 抓取網頁內容
 */
export async function fetchWebContent(url: string): Promise<string> {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error('無法抓取網頁內容');
    }

    const data = await response.json();
    const html = data.contents;

    // 簡單的 HTML 清理
    const text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return text.substring(0, 3000);
  } catch (error) {
    console.error('網頁抓取失敗:', error);
    throw error;
  }
}

/**
 * 使用 AI 分析網頁內容
 */
export async function analyzeProductFromUrl(url: string, model?: string): Promise<any> {
  try {
    console.log('📡 開始抓取網頁:', url);
    const webContent = await fetchWebContent(url);
    console.log('✅ 網頁內容抓取完成');

    const prompt = `
請分析以下網頁內容，提取商品資訊，並以 JSON 格式回傳：

網頁內容：
${webContent}

請回傳格式（只回傳 JSON，不要其他文字）：
{
  "name": "商品名稱",
  "description": "商品簡短描述（50字內）",
  "category": "商品分類",
  "price": 價格數字或null,
  "attributes": {
    "color": ["顏色1", "顏色2"],
    "size": ["尺寸1"],
    "material": "材質",
    "usage": ["用途1", "用途2"]
  }
}
    `;

    const result = await callOpenRouter(
      prompt,
      '你是一位專業的商品資訊分析專家，擅長從網頁內容中提取結構化的商品資訊。請只回傳 JSON 格式，不要加上其他說明文字。',
      model || AVAILABLE_MODELS.FREE.id
    );

    // 解析 JSON
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('✅ 商品分析完成:', parsed);
      return parsed;
    }

    throw new Error('無法解析商品資訊');
  } catch (error) {
    console.error('商品分析失敗:', error);
    throw error;
  }
}

/**
 * 生成商品文案
 */
export async function generateProductCopy(
  productName: string,
  productDescription: string,
  copyType: string,
  model?: string
): Promise<{ title: string; content: string; keywords: string[] }> {
  const prompts: Record<string, string> = {
    seo: `
請為以下商品撰寫 SEO 優化版文案：

商品名稱：${productName}
商品描述：${productDescription}

要求：
1. 標題要包含主要關鍵字，60字以內
2. 內容要自然融入關鍵字，150-200字
3. 提供 5-8 個相關關鍵字

回傳 JSON 格式（只回傳 JSON，不要其他文字）：
{
  "title": "標題",
  "content": "內容",
  "keywords": ["關鍵字1", "關鍵字2"]
}
    `,
    ecommerce: `
請為以下商品撰寫電商銷售版文案：

商品名稱：${productName}
商品描述：${productDescription}

要求：
1. 標題要吸引人，強調優惠或特色
2. 內容要包含：特色列表、優惠資訊、CTA
3. 使用適當的 emoji 增加吸引力
4. 200-300字

回傳 JSON 格式（只回傳 JSON）：
{
  "title": "標題",
  "content": "內容（可使用 emoji 和換行符號\\n）",
  "keywords": ["關鍵字1", "關鍵字2"]
}
    `,
    emotional: `
請為以下商品撰寫感性故事版文案：

商品名稱：${productName}
商品描述：${productDescription}

要求：
1. 用故事化的方式呈現
2. 創造情感共鳴
3. 避免過度推銷
4. 200-300字

回傳 JSON 格式（只回傳 JSON）：
{
  "title": "標題",
  "content": "故事內容",
  "keywords": ["關鍵字1", "關鍵字2"]
}
    `,
    short_title: `
請為以下商品撰寫簡短標題：

商品名稱：${productName}
商品描述：${productDescription}

要求：
1. 標題 20-30 字
2. 簡潔有力
3. 包含核心賣點

回傳 JSON 格式（只回傳 JSON）：
{
  "title": "簡短標題",
  "content": "一句話描述（30字內）",
  "keywords": ["關鍵字1", "關鍵字2"]
}
    `,
    shopee_spec: `
請為以下商品撰寫蝦皮格式文案：

商品名稱：${productName}
商品描述：${productDescription}

要求：
1. 標題 60 字以內，包含規格
2. 內容要包含：完整規格、賣點列表
3. 使用蝦皮常見格式（✓ 符號、分段清楚）

回傳 JSON 格式（只回傳 JSON）：
{
  "title": "標題",
  "content": "規格＋賣點內容",
  "keywords": ["關鍵字1", "關鍵字2"]
}
    `
  };

  try {
    const prompt = prompts[copyType] || prompts.ecommerce;
    const result = await callOpenRouter(
      prompt,
      '你是專業的電商文案撰寫專家。請只回傳 JSON 格式，不要加上其他說明文字。',
      model || AVAILABLE_MODELS.FREE.id
    );

    // 解析 JSON
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('✅ 文案生成完成');
      return parsed;
    }

    throw new Error('無法解析文案');
  } catch (error) {
    console.error('文案生成失敗:', error);
    throw error;
  }
}

/**
 * 生成受眾分析
 */
export async function analyzeAudience(
  productName: string,
  productDescription: string,
  model?: string
): Promise<any> {
  const prompt = `
請分析以下商品的目標受眾：

商品名稱：${productName}
商品描述：${productDescription}

請提供詳細的受眾分析，回傳 JSON 格式（只回傳 JSON，不要其他文字）：
{
  "productName": "${productName}",
  "suggestedAudiences": [
    {
      "name": "受眾名稱",
      "description": "描述",
      "size": "small/medium/large",
      "relevanceScore": 95,
      "suggestedPlatforms": ["instagram", "facebook"]
    }
  ],
  "demographics": {
    "ageRange": ["18-24", "25-34"],
    "gender": ["女性 60%", "男性 40%"],
    "interests": ["興趣1", "興趣2"],
    "behaviors": ["行為1", "行為2"]
  },
  "keywords": ["關鍵字1", "關鍵字2"],
  "targetMarkets": ["台灣", "香港"]
}

請提供 3-5 個建議受眾群體。
  `;

  try {
    const result = await callOpenRouter(
      prompt,
      '你是專業的市場分析專家。請只回傳 JSON 格式，不要加上其他說明文字。',
      model || AVAILABLE_MODELS.FREE.id
    );

    // 解析 JSON
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('✅ 受眾分析完成');
      return parsed;
    }

    throw new Error('無法解析受眾分析');
  } catch (error) {
    console.error('受眾分析失敗:', error);
    throw error;
  }
}
