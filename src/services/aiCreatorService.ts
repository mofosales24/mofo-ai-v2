const parseAI = (t: string) => {
  try { return JSON.parse(t.replace(/```json/g, '').replace(/```/g, '').trim()); } 
  catch (e) { return null; }
};
async function callProxy(sys: string, prompt: string) {
  const res = await fetch('/api/creator-proxy', { method: 'POST', body: JSON.stringify({ systemInstruction: sys, prompt }) });
  return parseAI(await res.text());
}
export const aiCreatorService = {
  generateTarget: (f: any) => callProxy("你係香港保險大師。分析3個受眾。輸出JSON Array: [{\"type\":\"人群\",\"reason\":\"原因\"}]", JSON.stringify(f)),
  generatePains: (t: string) => callProxy("分析呢個人群5個保險痛點。輸出JSON Array", t),
  generateBios: (d: any) => callProxy("生成6款唔同風格嘅粵語IG Bio。輸出JSON Object: {\"s1\":\"...\",\"s2\":\"...\"}", d.target),
  generateTitles: (d: any) => callProxy("生成10個選題(5價值,5共鳴)。輸出JSON Array", d.target),
  generateMatrix: (d: any) => callProxy("你是自媒體專家。生成：1.影片腳本 2.懶人包 3.Threads文案 4.參考影片。用廣東話口語。", d.topic)
};
