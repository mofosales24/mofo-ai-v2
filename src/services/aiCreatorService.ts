// src/services/aiCreatorService.ts
async function callProxy(system: string, prompt: string) {
  const res = await fetch('/api/creator-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemInstruction: system, prompt }),
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export const aiCreatorService = {
  // C. 根據用戶背景生成目標人群
  generateTargetAudiences: (form: any) => {
    const sys = "根據用戶嘅職業、人生經歷同喜好，分析出3個佢最熟悉、最容易成交嘅目標人群。輸出JSON Array: [{\"type\":\"人群名\",\"reason\":\"點解適合你\"}]";
    return callProxy(sys, JSON.stringify(form));
  },

  // D. 生成人群痛點
  generatePainPoints: (target: string) => {
    const sys = "分析呢個目標人群喺保險理財上嘅5個核心痛點同需求。輸出JSON Array: [\"痛點1\", \"...\"]";
    return callProxy(sys, target);
  },

  // E. 生成 6 款不同風格 Bio
  generateSixBios: (d: any) => {
    const sys = "生成6款IG個人檔案。1.首選專家 2.首選朋友 3.次選專家 4.次選朋友 5.混合專家 6.混合朋友。輸出JSON Object: {\"s1\":\"...\", \"s2\":\"...\"}";
    return callProxy(sys, `受眾:${d.target}, 痛點:${d.pain}, 範疇:${d.p1}及${d.p2}`);
  },

  // F. 生成影片題目
  generateVideoTitles: (d: any) => {
    const sys = "生成10個吸睛嘅影片題目。5個「價值型」，5個「共鳴型」。考慮用戶個人風格。輸出JSON Array: [{\"title\":\"...\",\"type\":\"價值/共鳴\"}]";
    return callProxy(sys, JSON.stringify(d));
  },

  // G. 生成拍攝形式建議 (可選)
  generateShootFormats: (topic: string) => {
    const sys = "針對呢個題目，建議4種適合嘅拍攝形式（如B-Roll、對鏡頭講嘢等）。輸出JSON Array: [{\"format\":\"...\",\"reason\":\"...\"}]";
    return callProxy(sys, topic);
  },

  // H. 生成最終全套內容 (名稱統一為 generateFinalMatrix)
  generateFinalMatrix: (d: any) => {
    const sys = "你是自媒體大師。針對選定題目同拍攝形式，生成：1. 影音腳本 2. 懶人包大綱 3. Threads 爆紅文案 4. 建議參考影片內容。";
    return callProxy(sys, JSON.stringify(d));
  }
};