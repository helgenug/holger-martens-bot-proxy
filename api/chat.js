// api/chat.js — Holger-Martens Proxy mit Branchen-Links, Telefonnummer & Auto-Verlinkung

// ===== Knowledge / Links =====
const SITE = "https://www.holger-martens.com";

// interne Seiten (Primärquelle)
const LINKS = {
  home: `${SITE}/`,
  kontakt: `${SITE}/kontakt`,
  ueber: `${SITE}/fotograf-warnemuende`,
  portfolio: `${SITE}/rostock-fotograf`,
  bildkunst: `${SITE}/fotokunst`,
  ausstellungen: `${SITE}/ausstellungen`,
  aktuelles: `${SITE}/aktuelles`,
  warnemuende: `${SITE}/fotograf-warnemuende`,
  stock_warnemuende: `${SITE}/warnemuende-stockfotos`,
  landschaft: `${SITE}/landschaft`,
  street: `${SITE}/street-holger-martens`,
  reportage: `${SITE}/reportagefotografie`,
  industrie: `${SITE}/industriefotograf`,
  architektur: `${SITE}/architektur`,
  food: `${SITE}/foodfotografie`,
  studio: `${SITE}/studiofotografie-rostock`,
  reise: `${SITE}/reise`,
  segelsport: `${SITE}/segelsportfotograf`,
  referenzen: `${SITE}/referenzen`,
  hochzeitsfotografie: `${SITE}/hochzeitsfotografie`,
  hochzeit_warnemuende: `${SITE}/hochzeitsfotograf-warnemuende`,
  hochzeit_rostock: `${SITE}/hochzeit-in-rostock`,
  hochzeit_schwerin: `${SITE}/hochzeit-in-schwerin`,
  hochzeit_samow: `${SITE}/hochzeit-schloss-samow`,
  hochzeit_heiligendamm: `${SITE}/hochzeit-in-heiligendamm`,
  hotelfotografie: `${SITE}/hotelfotografie`,
  ferienhaus: `${SITE}/ferienhausfotografie`,
  hotel_neptun: `${SITE}/hotel-neptun`,
  bilder_verkauf: `${SITE}/bilder-verkauf`,
  leinwand_acryl: `${SITE}/fotos-leinwand-acryl`,
  blog: `${SITE}/blog-rostocker-fotograf`,
  streetview: `${SITE}/google-streetview`,
  impressum: `${SITE}/impressum`,
  datenschutz: `${SITE}/datenschutz`
};

// Telefon + Mail
const CONTACT = {
  phone: "+49 170 7991910", // <<< deine aktuelle Telefonnummer
  mail: "mailto:fotograf@holger-martens.com"
};

// Kurz-Bio (nur Kontext)
const BIO = `
Holger Martens – Fotograf & Fotokünstler aus Rostock.
Telefon: ${CONTACT.phone}
E-Mail: fotograf@holger-martens.com
Schwerpunkte: Industrie, Reportage/Event, Hotellerie/Architektur, Fine-Art.
Kontaktseite: ${LINKS.kontakt}
`;

// einfache Keyword → Link Auswahl
function pickLinks(userText) {
  const t = (userText || "").toLowerCase();
  if (t.includes("preis") || t.includes("price") || t.includes("angebot") || t.includes("buch") || t.includes("book"))
    return [LINKS.portfolio, LINKS.kontakt];
  if (t.includes("telefon") || t.includes("anrufen") || t.includes("phone") || t.includes("call"))
    return [LINKS.kontakt, CONTACT.phone];
  return [LINKS.portfolio, LINKS.ueber];
}

// ===== System Prompt =====
const sys = [
  "You are the assistant for 'Holger Martens – Fotografie & Bildkunst'.",
  "STRICT LANGUAGE MIRRORING: Answer strictly in the language used by the user. Do not mix languages. Translate only if explicitly asked.",
  "Scope: questions about Holger, services (industry, reportage/events, hotel/hospitality, architecture, studio, food), fine-art, references, portfolio, process, availability, exhibitions, prints, pricing approach (ranges only), and contact.",
  "Tone: concise, precise, professional; 1–4 sentences; no small talk, no fluff.",
  "Link policy: Prefer holger-martens.com. Use short Markdown links. For contact questions, you may also output Holger's phone and email.",
  "If unsure or info is missing, say so briefly and point to the contact page.",
  "Never mention competitors. No legal/medical advice.",
  "",
  "Whitelisted internal: " + Object.values(LINKS).join(", "),
  "Contact: Phone " + CONTACT.phone + ", Mail " + CONTACT.mail,
  "Bio (do not output verbatim unless asked): " + BIO,
  "",
  "Output rules:",
  "- Add 1–3 helpful links (prefer deep pages).",
  `- Example: [Industriefotografie](${LINKS.industrie}) · [Referenzen](${LINKS.referenzen}) · Telefon: ${CONTACT.phone} · [Kontakt](${LINKS.kontakt})`
].join("\n");

// ===== Handler =====
export default async function handler(req, res) {
  // CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
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

    // OpenAI Request
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

    const data = await r.json();
    if (!r.ok) {
      return res.status(500).json({ error: "OpenAI error", details: data });
    }

    // Antwort + Link-Enrichment
    let finalReply = (data?.choices?.[0]?.message?.content || "").trim();

    // Fallback: falls kein Link enthalten ist
    const hasInternal = finalReply.includes("holger-martens.com");
    if (!hasInternal) {
      const [a, b] = pickLinks(message);
      finalReply += `\n\n[Mehr dazu](${a}) · [Kontakt](${LINKS.kontakt}) · Telefon: ${CONTACT.phone}`;
    }

    // Telefon-Einblendung bei passenden Keywords
    const lower = message.toLowerCase();
    if (lower.includes("telefon") || lower.includes("phone") || lower.includes("anrufen") || lower.includes("call")) {
      if (!finalReply.includes(CONTACT.phone)) {
        finalReply += `\n\nTelefon: ${CONTACT.phone}`;
      }
    }

    return res.status(200).json({ reply: finalReply });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
