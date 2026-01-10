import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-001",
  systemInstruction: "你係香港保險自媒體大神。說話口吻係地道香港粵語口語。必須只輸出 JSON，唔好有任何解釋文字。"
});

// ✅ 強大嘅 JSON 清洗器，確保唔會回傳 null
const safeParse = (text: string, isArray = true) => {
  try {
    const jsonMatch = text.match(/\[.*\]|\{.*\}/s);
    if (!jsonMatch) return isArray ? [] : {};
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("[MOFO_DEBUG] JSON 解析失敗:", e);
    return isArray ? [] : {};
  }
};

export const aiService = {
  async getTargets(profile: any) {
    const prompt = `分析3個適合佢嘅「目標銷售對象」：職業 ${profile.profession}, 經歷 ${profile.experience}, 喜好 ${profile.hobbies}。格式：[{"type": "受眾名", "reason": "原因"}]`;
    const res = await model.generateContent(prompt);
    return safeParse(res.response.text(), true);
  },

  async getPains(targets: string[]) {
    const prompt = `針對受眾 ${targets.join(', ')}，分析5個保險痛點。格式：[{"point": "痛點", "need": "需求"}]`;
    const res = await model.generateContent(prompt);
    return safeParse(res.response.text(), true);
  },

  async getStrategies(pains: string[]) {
    const prompt = `針對痛點 ${pains.join('、')}，生成朋友型、專家型、混合型策略概覽。格式：[{"type": "類型", "description": "內容", "tone": "語氣"}]`;
    const res = await model.generateContent(prompt);
    return safeParse(res.response.text(), true);
  },

  async getFinalScript(topic: string, profile: any, strategy: string) {
    const prompt = `寫一個詳細影音腳本。題目：${topic}，風格：${strategy}。格式：{"topic": "${topic}", "steps": [{"scene": "1", "visual": "畫面", "audio": "對白"}]}`;
    const res = await model.generateContent(prompt);
    return safeParse(res.response.text(), false);
  },

  async getExtensions(topic: string) {
    const prompt = `題目 ${topic} 延伸 5 個方向。格式：["方向1", "方向2"]`;
    const res = await model.generateContent(prompt);
    return safeParse(res.response.text(), true);
  }
};

export const generatePainPoints = async () => [];