const parseAIResponse = (text: string) => {
  try {
    // 移除 AI 可能輸出的 ```json ... ``` 標籤
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error. Raw text:", text);
    return null;
  }
};

async function callProxy(system: string, prompt: string) {
  const res = await fetch('/api/creator-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemInstruction: system, prompt }),
  });
  const text = await res.text();
  return parseAIResponse(text) || text; // 如果解析失敗就回傳原文字
}

export const aiCreatorService = {
  generateTargetAudiences: (form: any) => {
    const sys = "你係保險自媒體導師。分析3個最適合用戶嘅受眾。必須只輸出 JSON Array: [{\"type\":\"人群名\",\"reason\":\"原因\"}]，唔好比任何解釋文字。";
    return callProxy(sys, JSON.stringify(form));
  },
  generatePainPoints: (target: string) => {
    const sys = "針對該受眾列出5個保險理財痛點。必須只輸出 JSON Array: [\"痛點1\", \"...\"]";
    return callProxy(sys, target);
  },
  generateSixBios: (d: any) => {
    const sys = "生成6款IG Bio。必須只輸出 JSON Object: {\"s1\":\"...\", \"s2\":\"...\", \"s3\":\"...\", \"s4\":\"...\", \"s5\":\"...\", \"s6\":\"...\"}";
    return callProxy(sys, `受眾:${d.target}, 範疇:${d.p1}`);
  },
  generateVideoTitles: (d: any) => {
    const sys = "生成10個影片題目。必須只輸出 JSON Array: [{\"title\":\"...\",\"type\":\"價值/共鳴\"}]";
    return callProxy(sys, JSON.stringify(d));
  },
  generateFinalContent: (d: any) => {
    const sys = "你是自媒體大師。生成：1.影音腳本 2.懶人包 3.Threads文案 4.參考影片方向。用粵語口語。";
    return callProxy(sys, JSON.stringify(d));
  }
};
