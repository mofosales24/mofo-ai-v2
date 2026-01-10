const parseAI = (text: string) => {
  try {
    const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) { return null; }
};
async function callProxy(sys: string, prompt: string) {
  const res = await fetch('/api/creator-proxy', { method: 'POST', body: JSON.stringify({ systemInstruction: sys, prompt }) });
  const text = await res.text();
  return parseAI(text) || text;
}
export const aiCreatorService = {
  generateTargetAudiences: (f: any) => callProxy("分析3個適合用戶嘅受眾。輸出 JSON Array: [{\"type\":\"人群名\",\"reason\":\"原因\"}]", JSON.stringify(f)),
  generatePainPoints: (target: string) => callProxy("列出5個痛點。輸出 JSON Array", target),
  generateSixBios: (d: any) => callProxy("生成6款IG Bio。輸出 JSON Object", d.target),
  generateVideoTitles: (d: any) => callProxy("生成10個吸睛題目。輸出 JSON Array", d.target),
  generateFinalContent: (d: any) => callProxy("生成全套內容矩陣。用粵語口語。", d.topic)
};
