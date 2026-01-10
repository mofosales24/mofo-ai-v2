const extractJSON = (text: string) => {
  try {
    let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const first = Math.min(clean.indexOf('[') === -1 ? 9999 : clean.indexOf('['), clean.indexOf('{') === -1 ? 9999 : clean.indexOf('{'));
    const last = Math.max(clean.lastIndexOf(']'), clean.lastIndexOf('}'));
    return JSON.parse(clean.substring(first, last + 1));
  } catch (e) { return null; }
};

async function callProxy(sys: string, prompt: string) {
  const res = await fetch('/api/creator-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemInstruction: sys, prompt }),
  });
  const text = await res.text();
  return extractJSON(text);
}

export const aiCreatorService = {
  generateTargetAudiences: (f: any) => callProxy("分析3個最適合用戶背景嘅受眾。輸出 JSON Array: [{\"type\":\"人群名\",\"reason\":\"原因\"}]", JSON.stringify(f)),
  generatePainPoints: (target: string) => callProxy("針對呢個人群分析5個保險痛點。輸出 JSON Array: [\"痛點1\", \"...\"]", target),
  generateSixBios: (d: any) => callProxy("生成6款唔同風格IG Bio。輸出 JSON Object: {\"s1\":\"...\", \"s2\":\"...\"}", d.target),
  generateVideoTitles: (d: any) => callProxy("生成10個選題(價值+共鳴)。輸出 JSON Array: [{\"title\":\"...\",\"type\":\"價值\"}]", d.target),
  generateFinalContent: (d: any) => callProxy("你是自媒體導師。生成詳細影音腳本、Threads文案。用廣東話口語。", d.topic)
};