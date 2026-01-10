import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { BrandData, GeneratedBio, ContentPlan, BrandMode } from "../types";

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  console.error("❌ 錯誤: 找不到 VITE_API_KEY。");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

// ✅ 這裡絕對是 gemini-2.0-flash
const MODEL_NAME = "gemini-2.0-flash"; 

export const generatePainPoints = async (mode: BrandMode, data: Partial<BrandData>): Promise<string[]> => {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: `你是一位資深保險行銷專家。請預測 8 個簡短痛點。語言：繁體中文（香港粵語口語化）。`,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
    }
  });
  const prompt = `模式: ${mode}, 專業範疇: ${data.domain || data.customDomain}, 客群: ${data.lifeStage || data.customLifeStage}`;
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
};

export const generateBio = async (mode: BrandMode, data: BrandData): Promise<GeneratedBio> => {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: `你是一位保險品牌專家。請生成 Bio JSON。displayName格式：[名字]|[定位]`,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          displayName: { type: SchemaType.STRING },
          line1_value: { type: SchemaType.STRING },
          line2_trust: { type: SchemaType.STRING },
          line3_unique: { type: SchemaType.STRING },
          line4_cta: { type: SchemaType.STRING }
        },
        required: ["displayName", "line1_value", "line2_trust", "line3_unique", "line4_cta"]
      }
    }
  });
  const result = await model.generateContent(JSON.stringify(data));
  return JSON.parse(result.response.text());
};

export const generateTopics = async (bio: GeneratedBio, _data: BrandData): Promise<string[]> => {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: `生成 10 個保險話題標題`,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
    }
  });
  const result = await model.generateContent("生成標題");
  return JSON.parse(result.response.text());
};

export const generateDetailedContent = async (topic: string, bio: GeneratedBio, data: BrandData): Promise<ContentPlan> => {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: `你是一位內容行銷總監。語言：繁體中文（香港粵語口語化）。`,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          script: {
            type: SchemaType.OBJECT,
            properties: {
              steps: { type: SchemaType.ARRAY, items: { type: SchemaType.OBJECT, properties: { stage: { type: SchemaType.STRING }, dialogue: { type: SchemaType.STRING }, visuals: { type: SchemaType.STRING } }, required: ["stage", "dialogue", "visuals"] } },
              caption: { type: SchemaType.STRING },
              hashtags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
            },
            required: ["steps", "caption", "hashtags"]
          },
          thread: { type: SchemaType.OBJECT, properties: { title: { type: SchemaType.STRING }, content: { type: SchemaType.STRING } }, required: ["title", "content"] },
          leadMagnet: { type: SchemaType.OBJECT, properties: { title: { type: SchemaType.STRING }, table: { type: SchemaType.OBJECT, properties: { headers: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }, rows: { type: SchemaType.ARRAY, items: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } } } }, required: ["headers", "rows"] }, sections: { type: SchemaType.ARRAY, items: { type: SchemaType.OBJECT, properties: { title: { type: SchemaType.STRING }, items: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } } }, required: ["title", "items"] } }, checklist: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } } }, required: ["title", "table", "sections", "checklist"] }
        },
        required: ["script", "thread", "leadMagnet"]
      }
    }
  });
  const prompt = JSON.stringify({ topic, brand_persona: bio, target_audience: { lifeStage: data.lifeStage || data.customLifeStage, painPoints: data.painPoints || [] } });
  const result = await model.generateContent(prompt);
  const res = JSON.parse(result.response.text());
  return { selectedTopic: topic, ...res };
};
// 標記：TIMESTAMP-$(date +%s)
