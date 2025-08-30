// api/chat.js — Holger-Martens Proxy mit Branchen-Links & Auto-Verlinkung

// ===== Knowledge / Links =====
const SITE = "https://www.holger-martens.com";

// interne Seiten (Primärquelle)
const LINKS = {
  home: `${SITE}/`,
  kontakt: `${SITE}/kontakt`,
  ueber: `${SITE}/ueber-mich`,
  portfolio: `${SITE}/portfolio`,
  bildkunst: `${SITE}/fotokunst`,            // falls abweichend: /bildkunst
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
  kopie_referenzen: `${SITE}/kopie-von-referenzen`,
  kopie_landemarketing: `${SITE}/kopie-von-landesmarketing-mv`,
  dnvgl: `${SITE}/dnvgl-industrie-fotograf`,
  dachser: `${SITE}/dachser`,
  liebherr: `${SITE}/liebherrfotografie`,
  caterpillar: `${SITE}/caterpillar-fotograf`,
  edelstahl: `${SITE}/edelstahl-fotograf`,
  stahlguss: `${SITE}/stahlguss-fotograf`,
  mv_werften: `${SITE}/mv-werften-industriefotografien`,
  habhallenbau: `${SITE}/habhallenbau`,
  fotoreportage_rostock: `${SITE}/fotoreportage-rostock`,
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
  datenschutz: `${SITE}/datenschutz`,
  rostock_fotograf: `${SITE}/rostock-fotograf`,
  magazine2017: `${SITE}/magazine2017`,
  fotograf_warnemuende: `${SITE}/fotograf-warnemuende`,
  kunstfotograf: `${SITE}/kunstfotograf`,
  photografie: `${SITE}/photografie`
};

// whitelisted extern (nur wenn direkt relevant)
const EXT = {
  odr_de: "https://www.ec.europa.eu/consumers/odr",
  odr_en: "https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.adr.show",
  grandhotel: "https://www.grandhotel-heiligendamm.de/",
  immenhof: "https://gut-immenhof.de/",
  hinstorff: "https://www.hinstorff.de/Unerhoerte-Orte.-Reisefuehrer-der-Festspiele-Mecklenburg-Vorpommern/sw769",
  facebook: "https://www.facebook.com/Fotograf.Holger.Martens",
  twitter: "https://twitter.com/helgenug",
  instagram: "https://www.instagram.com/holger.martens/",
  mail_info: "mailto:info@holger-martens.com",
  mail_fotograf: "mailto:fotograf@holger-martens.com"
};

// Branchen/Use-Cases → primäre Zielseiten
const SECTORS = [
  { key: "industrie",      kws: ["industrie","industrial","fabrik","produktion","werk","werft","shipyard","maschinenbau","stahl","edelstahl","stahlguss","dnvgl","dachser","liebherr","caterpillar"], links: [LINKS.industrie, LINKS.referenzen] },
  { key: "reportage",      kws: ["reportage","event","veranstaltung","dokumentation","doku","rostock"], links: [LINKS.reportage, LINKS.fotoreportage_rostock] },
  { key: "architektur",    kws: ["architektur","architecture","gebäude","interior","innenarchitektur","hotel","immobilie"], links: [LINKS.architektur, LINKS.hotelfotografie] },
  { key: "hotel",          kws: ["hotel","hotellerie","hospitality","neptun","grandhotel","heiligendamm"], links: [LINKS.hotelfotografie, LINKS.hotel_neptun] },
  { key: "ferienhaus",     kws: ["ferienhaus","ferienwohnung","fewo","airbnb"], links: [LINKS.ferienhaus, LINKS.architektur] },
  { key: "food",           kws: ["food","gastronomie","restaurant","speisen","küche"], links: [LINKS.food, LINKS.portfolio] },
  { key: "hochzeit",       kws: ["hochzeit","wedding","trauung","braut","heiligendamm","samow","schwerin","warnemünde","rostock"], links: [LINKS.hochzeitsfotografie, LINKS.hochzeit_heiligendamm] },
  { key: "bildkunst",      kws: ["kunst","fine art","bildkunst","prints","ausstellung","galerie"], links: [LINKS.bildkunst, LINKS.ausstellungen] },
  { key: "landschaft",     kws: ["landschaft","coast","ostsee","mecklenburg","warnemünde"], links: [LINKS.landschaft, LINKS.stock_warnemuende] },
  { key: "street",         kws: ["street","straße","streetfotografie","urban"], links: [LINKS.street, LINKS.portfolio] },
  { key: "studio",         kws: ["studio","portrait","produkt","headshot","werbung"], links: [LINKS.studio, LINKS.portfolio] },
  { key: "segelsport",     kws: ["segel","regatta","segeln","sailing","yacht"], links: [LINKS.segelsport, LINKS.portfolio] },
];

// Kurz-Bio (nur Kontext)
const BIO = `
Holger Martens – Fotograf & Fotokünstler aus der Hansestadt Rostock.
Schwerpunkte: Industrie/Unternehmen, Reportage/Event, Hotellerie/Architektur sowie Bildkunst/Fine-Art.
Klarer, reduzierter Stil; präzises Licht; serielle Konzepte. Studio & On-Location, bundesweit.
Kontakt: ${LINKS.kontakt}
`;

// einfache Keyword → Link Auswahl
function pickLinks(userText) {
  const t = (userText || "").toLowerCase();
  for (const s of SECTORS) {
    if (s.kws.some(k => t.includes(k))) return s.links;
  }
  // Defaults
  if (t.includes("preis") || t.includes("price") || t.includes("buch") || t.includes("book"))
    return [LINKS.portfolio, LINKS.kontakt];
  return [LINKS.portfolio, LINKS.ueber];
}

// ===== System Prompt =====
const sys = [
  "You are the assistant for 'Holger Martens – Fotografie & Bildkunst'.",
  "STRICT LANGUAGE MIRRORING: Answer strictly in the language used by the user. Do not mix languages. Translate only if explicitly asked.",
  "Scope: questions about Holger, services (industry, reportage/events, hotel/hospitality, architecture, studio, food), fine-art, references, portfolio, process, availability, exhibitions, prints, pricing approach (ranges only), and contact.",
  "Tone: concise, precise, professional; 1–4 sentences; no small talk, no fluff.",
  "Link policy: Prefer holger-martens.com. You may use whitelisted externals only when directly relevant (ODR notice, selected client pages, official social). Use short Markdown links.",
  "If unsure or info is missing, say so briefly and point to the contact page.",
  "Never mention competitors. No legal/medical advice.",
  "",
  "Whitelisted internal: " + Object.values(LINKS).join(", "),
  "Whitelisted external: " + Object.values(EXT).join(", "),
  "Bio (do not output verbatim unless asked): " + BIO,
  "",
  "Output rules:",
  "- Add 1–3 helpful links (prefer deep pages).",
  `- Example: [Industriefotografie](${LINKS.industrie}) · [Referenzen](${LINKS.referenzen}) · [Kontakt](${LINKS.kontakt}).`
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

    // Falls noch kein interner Link vorhanden ist, ergänze passende Branchen-Links
    const hasInternal = finalReply.includes("holger-martens.com");
    if (!hasInternal) {
      const [a, b] = pickLinks(message);
      finalReply += `\n\n[Mehr dazu](${a}) · [Kontakt](${b || LINKS.kontakt})`;
    }

    // Minimaler Pflicht-CTA bei Preis/Booking-Anfragen
    const msgL = message.toLowerCase();
    if (msgL.includes("preis") || msgL.includes("price") || msgL.includes("angebot") || msgL.includes("book") || msgL.includes("buchen")) {
      if (!finalReply.includes(LINKS.kontakt)) {
        finalReply += `\n\n[Kontakt](${LINKS.kontakt})`;
      }
    }

    return res.status(200).json({ reply: finalReply });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
