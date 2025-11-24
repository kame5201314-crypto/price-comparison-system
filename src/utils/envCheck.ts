// 環境變數診斷工具

export function checkEnv() {
  console.log('='.repeat(60));
  console.log('🔍 環境變數診斷');
  console.log('='.repeat(60));

  const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const openAIKey = import.meta.env.VITE_OPENAI_API_KEY;
  const aiModel = import.meta.env.VITE_AI_MODEL;

  console.log('📌 VITE_OPENROUTER_API_KEY:', openRouterKey ? `✓ 已設定 (${openRouterKey.substring(0, 20)}...)` : '✗ 未設定');
  console.log('📌 VITE_OPENAI_API_KEY:', openAIKey ? `✓ 已設定 (${openAIKey.substring(0, 20)}...)` : '✗ 未設定');
  console.log('📌 VITE_AI_MODEL:', aiModel || '未設定（將使用預設值）');

  console.log('\n📊 環境變數物件:');
  console.log(import.meta.env);

  console.log('='.repeat(60));

  return {
    hasOpenRouter: !!openRouterKey,
    hasOpenAI: !!openAIKey,
    model: aiModel
  };
}
