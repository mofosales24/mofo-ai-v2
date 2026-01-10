const extract = (t: string) => {
  try {
    let c = t.replace(/```json/g, '').replace(/```/g, '').trim();
    const f = Math.min(c.indexOf('[')===-1?999:c.indexOf('['), c.indexOf('{')===-1?999:c.indexOf('{'));
    const l = Math.max(c.lastIndexOf(']'), c.lastIndexOf('}'));
    return JSON.parse(c.substring(f, l + 1));
  } catch (e) { return null; }
};
async function call(sys: string, p: string) {
  const r = await fetch('/api/creator-proxy', { method: 'POST', body: JSON.stringify({ systemInstruction: sys, prompt: p }) });
  return extract(await r.text());
}
export const aiCreatorService = {
  generateTargetAudiences: (f: any) => call("分析3個受眾。輸出JSON Array: [{\"type\":\"人群\",\"reason\":\"原因\"}]", JSON.stringify(f)),
  generatePainPoints: (t: string) => call("分析5個保險痛點。輸出JSON Array", t),
  generateSixBios: (d: any) => call("生成6款IG Bio。輸出JSON Object: {\"s1\":\"...\",\"s2\":\"...\"}", d.target),
  generateVideoTitles: (d: any) => call("生成10個吸睛影片選題。輸出JSON Array", d.target),
  generateFinalContent: (d: any) => call("生成影片腳本、Threads文案。用粵語口語。", d.topic)
};
