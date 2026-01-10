import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-001",
  systemInstruction: "你係香港保險自媒體大神。說話口吻係地道香港粵語。必須只輸出純 JSON，唔好有任何文字解釋。"
});

// ✅ 終極 JSON 清洗器：解決 t.map is not a function 的根本問題
const toSafeArray = (text: string): any[] => {
  try {
    const jsonMatch = text.match(/\[.*\]|\{.*\}/s);
    if (!jsonMatch) return [];
    const parsed = JSON.parse(jsonMatch[0]);
    
    // 如果 AI 回傳的是 {"targets": [...]} 而不是 [...]
    if (!Array.isArray(parsed) && typeof parsed === 'object') {
      const keys = Object.keys(parsed);
      for (const key of keys) {
        if (Array.isArray(parsed[key])) return parsed[key];
      }
      return [];
    }
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("[MOFO_DEBUG] 解析失敗:", e);
    return [];
  }
};

export const aiService = {
  async getTargets(profile: any) {
    const prompt = `根據職業 ${profile.profession} 同經歷 ${profile.experience}，分析3個適合佢嘅目標人群。格式：[{"type": "受眾名", "reason": "原因"}]`;
    const res = await model.generateContent(prompt);
    return toSafeArray(res.response.text());
  },

  async getPains(targets: string[]) {
    const prompt = `針對 ${targets.join(', ')}，分析5個保險痛點。格式：[{"point": "痛點", "need": "需求"}]`;
    const res = await model.generateContent(prompt);
    return toSafeArray(res.response.text());
  },

  async getStrategies(pains: string[]) {
    const prompt = `針對痛點 ${pains.join('、')}，生成朋友型、專家型、混合型策略。格式：[{"type": "類型", "description": "重點", "tone": "語氣"}]`;
    const res = await model.generateContent(prompt);
    return toSafeArray(res.response.text());
  },

  async getFinalScript(topic: string, profile: any, strategy: string) {
    const prompt = `寫一個拍攝腳本。題目：${topic}，風格：${strategy}。格式：{"topic": "${topic}", "steps": [{"scene": "1", "visual": "畫面", "audio": "對話"}]}`;
    const res = await model.generateContent(prompt);
    try {
      const jsonMatch = res.response.text().match(/\{.*\}/s);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { topic, steps: [] };
    } catch { return { topic, steps: [] }; }
  },

  async getExtensions(topic: string) {
    const prompt = `題目 ${topic} 延伸 5 個方向。格式：["方向1", "方向2"]`;
    const res = await model.generateContent(prompt);
    return toSafeArray(res.response.text());
  }
};