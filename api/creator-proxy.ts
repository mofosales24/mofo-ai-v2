// api/creator-proxy.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const { systemInstruction, prompt } = await req.json();
  const API_KEY = process.env.VITE_API_KEY; 

  const genAI = new GoogleGenerativeAI(API_KEY || "");
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: systemInstruction + `
      重要指令：
      1. 必須使用香港粵語（廣東話口語）輸出。
      2. 語氣要像地道的香港自媒體創作者，親切、直接、有深度。
      3. 多用助詞如：『嘅、嘢、咗、呢度、喇、㗎嘛』。
      4. 避開內地用語，使用香港保險業界常用術語（如：理賠、危疾、儲蓄保、扣稅、MPF）。`
  });

  try {
    const result = await model.generateContent(prompt);
    return new Response(result.response.text(), { headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}