import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-001",
  systemInstruction: "你係一位香港保險自媒體大神，專門幫人做個人品牌。你說話方式係地道香港粵語口語，多用助詞（嘅、嘢、咗、呢度、喇、㗎嘛）。所有 JSON 輸出必須嚴格符合格式，唔好比任何多餘文字。"
});

const cleanJSON = (text: string) => {
  try {
    const jsonMatch = text.match(/\[.*\]|\{.*\}/s);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (e) { return null; }
};

export const aiService = {
  async getTargets(profile: any) {
    const prompt = `根據背景分析3個最適合佢嘅「目標銷售對象」：職業 ${profile.profession}, 經歷 ${profile.experience}, 喜好 ${profile.hobbies}。格式：[{"type": "受眾名", "reason": "點解適合"}]`;
    const res = await model.generateContent(prompt);
    return cleanJSON(res.response.text());
  },
  async getPains(targets: string[]) {
    const prompt = `針對受眾 ${targets.join(', ')}，分析佢哋5個保險理財痛點。格式：[{"point": "痛點描述", "need": "需求"}]`;
    const res = await model.generateContent(prompt);
    return cleanJSON(res.response.text());
  },
  async getStrategies(pains: string[]) {
    const prompt = `針對痛點 ${pains.join('、')}，生成朋友型、專家型、混合型策略。格式：[{"type": "朋友型", "description": "重點", "tone": "語氣"}]`;
    const res = await model.generateContent(prompt);
    return cleanJSON(res.response.text());
  },
  async getFinalScript(topic: string, profile: any, strategy: string) {
    const prompt = `題目：${topic}，風格：${strategy}。寫一個拍攝腳本。格式：{"topic": "${topic}", "steps": [{"scene": "場景", "visual": "畫面", "audio": "對白"}]}`;
    const res = await model.generateContent(prompt);
    return cleanJSON(res.response.text());
  },
  async getExtensions(topic: string) {
    const prompt = `題目 ${topic} 延伸 5 個方向。格式：["方向1", "方向2"]`;
    const res = await model.generateContent(prompt);
    return cleanJSON(res.response.text());
  }
};

export const generatePainPoints = async () => [];