import axios from 'axios';

export interface ImageRecognitionResult {
  keywords: string[];
  category?: string;
  attributes?: Record<string, string>;
  confidence?: number;
  description?: string;
}

/**
 * Recognize product from image using AI
 */
export async function recognizeProductFromImage(
  imageUrl: string
): Promise<ImageRecognitionResult> {
  const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const openAIKey = import.meta.env.VITE_OPENAI_API_KEY;
  const model = import.meta.env.VITE_AI_MODEL || 'google/gemini-flash-1.5';

  if (openRouterKey) {
    return await recognizeWithOpenRouter(imageUrl, openRouterKey, model);
  } else if (openAIKey) {
    return await recognizeWithOpenAI(imageUrl, openAIKey);
  } else {
    throw new Error('No AI API key configured. Please set VITE_OPENROUTER_API_KEY or VITE_OPENAI_API_KEY');
  }
}

/**
 * Recognize product using OpenRouter (supports multiple AI models)
 */
async function recognizeWithOpenRouter(
  imageUrl: string,
  apiKey: string,
  model: string
): Promise<ImageRecognitionResult> {
  const prompt = `分析這張商品圖片，請提供以下資訊：
1. 商品名稱或類型（例如：iPhone 15 Pro、Nike運動鞋、筆記型電腦等）
2. 商品類別（例如：3C產品、服飾、家電等）
3. 主要特徵或屬性（例如：顏色、尺寸、品牌等）
4. 適合用來搜尋這個商品的關鍵字（至少3-5個）

請以JSON格式回應，格式如下：
{
  "keywords": ["關鍵字1", "關鍵字2", "關鍵字3"],
  "category": "商品類別",
  "attributes": {
    "品牌": "品牌名稱",
    "顏色": "顏色",
    "其他屬性": "值"
  },
  "description": "商品簡述"
}`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Smart Price Comparison',
        },
        timeout: 30000,
      }
    );

    const content = response.data.choices[0].message.content;

    // Try to parse JSON response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          keywords: parsed.keywords || [],
          category: parsed.category,
          attributes: parsed.attributes,
          description: parsed.description,
          confidence: 0.8,
        };
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON response, using text extraction');
    }

    // Fallback: extract keywords from text
    return extractKeywordsFromText(content);
  } catch (error) {
    console.error('OpenRouter image recognition error:', error);
    throw new Error('Failed to recognize image with OpenRouter');
  }
}

/**
 * Recognize product using OpenAI GPT-4 Vision
 */
async function recognizeWithOpenAI(
  imageUrl: string,
  apiKey: string
): Promise<ImageRecognitionResult> {
  const prompt = `分析這張商品圖片，請提供：
1. 商品名稱或類型
2. 商品類別
3. 主要特徵或屬性（顏色、品牌等）
4. 適合搜尋的關鍵字（3-5個）

請以JSON格式回應。`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const content = response.data.choices[0].message.content;

    // Try to parse JSON response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          keywords: parsed.keywords || [],
          category: parsed.category,
          attributes: parsed.attributes,
          description: parsed.description,
          confidence: 0.85,
        };
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON response');
    }

    return extractKeywordsFromText(content);
  } catch (error) {
    console.error('OpenAI image recognition error:', error);
    throw new Error('Failed to recognize image with OpenAI');
  }
}

/**
 * Extract keywords from AI text response as fallback
 */
function extractKeywordsFromText(text: string): ImageRecognitionResult {
  // Simple keyword extraction from text
  const keywords: string[] = [];

  // Common patterns to extract
  const lines = text.split('\n');
  lines.forEach((line) => {
    // Look for keywords section
    if (line.includes('關鍵字') || line.includes('keyword')) {
      const parts = line.split(/[:：]/);
      if (parts.length > 1) {
        const keywordPart = parts[1];
        const extracted = keywordPart.split(/[,，、]/).map(k => k.trim());
        keywords.push(...extracted);
      }
    }
  });

  // If no keywords found, use the whole text as a single keyword
  if (keywords.length === 0) {
    keywords.push(text.slice(0, 100).trim());
  }

  return {
    keywords: keywords.filter(k => k.length > 0).slice(0, 5),
    description: text.slice(0, 200),
    confidence: 0.5,
  };
}

/**
 * Upload image file and get URL for recognition
 */
export async function uploadImageForRecognition(file: File): Promise<string> {
  // Convert to base64 data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Search products by image
 */
export async function searchByImage(
  imageFile: File | string,
  platforms: string[]
): Promise<ImageRecognitionResult> {
  let imageUrl: string;

  if (typeof imageFile === 'string') {
    imageUrl = imageFile;
  } else {
    imageUrl = await uploadImageForRecognition(imageFile);
  }

  const recognition = await recognizeProductFromImage(imageUrl);

  return recognition;
}
