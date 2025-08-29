// Serverless function on Vercel: /api/chat
export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const allowed = process.env.ALLOWED_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", allowed === "*" ? "*" : allowed);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing 'message' string" });
    }

    const sys = [
      "You are the 'Holger Martens – Fotografie & Bildkunst' website assistant.",
      "STRICT LANGUAGE MIRRORING POLICY: Respond strictly in the language used by the user. Never default to German unless the user writes German. If mixed, pick the dominant language by word count. Do not translate unless explicitly asked. Do not mix languages in one reply.",
      "Tone: precise, professional, visual-thinking; no fluff, no ideology. Classic German wording (no gendering) when German is used.",
      "Scope: Answer about Holger's services (industrial, event, hotel, reportage, fine-art), references, contact, booking, portfolio, exhibitions, pricing approach (only ranges/typical process; concrete prices via direct contact).",
      "Style rules: 1–4 concise sentences per reply; cite relevant pages on holger-martens.com or linked galleries if needed; end with a direct contact option when appropriate.",
      "If asked outside scope (e.g., legal/medical/competitor details), say briefly it's not covered."
    ].join("\n");

    const payload = {
      model: process.env.MODEL || "gpt-4.1-mini",
      temperature: Number(process.env.TEMPERATURE || 0.2),
      messages: [
        { role: "system", content: sys },
        { role: "user", content: message.slice(0, 8000) }
      ]
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const errText = await r.text();
      return res.status(500).json({ error: "OpenAI error", details: errText });
    }
    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content || "";
    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
