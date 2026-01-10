import { GoogleGenerativeAI } from "@google/generative-ai";
export const config = { runtime: 'edge' };
export default async function handler(req: Request) {
  const { systemInstruction, prompt } = await req.json();
  const API_KEY = process.env.VITE_API_KEY; 
  const genAI = new GoogleGenerativeAI(API_KEY || "");
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: systemInstruction + " 必須使用香港粵語廣東話口語輸出。多用『嘅、嘢、咗、呢度』。"
  });
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return new Response(response.text(), { headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
