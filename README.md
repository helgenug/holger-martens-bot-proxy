# Holger‑Martens Bot – Vercel Proxy + Website‑Widget

## Deploy (Vercel)

1. Auf https://vercel.com einloggen → "New Project" → Repo importieren **oder** ZIP hochladen (über GitHub).  
2. In **Project Settings → Environment Variables** setzen:  
   - `OPENAI_API_KEY` = dein OpenAI‑Key  
   - `ALLOWED_ORIGIN` = `https://www.holger-martens.com` (zum Testen `*`)  
   - `MODEL` = `gpt-4.1-mini`  
   - `TEMPERATURE` = `0.2`  
3. Deploy starten.  
4. Test: `https://DEIN-PROJEKT.vercel.app/` (Widget) und `/api/chat` (Endpoint).

## Einbindung auf deiner Website (Strato/WordPress/Wix)

**Variante A: iFrame (am einfachsten)**
```html
<iframe src="https://DEIN-PROJEKT.vercel.app/" style="width:100%;height:650px;border:none;border-radius:12px;"></iframe>
```

**Variante B: Eigenes Frontend, nur Endpoint nutzen**
```js
async function askHolger(q){
  const r = await fetch("https://DEIN-PROJEKT.vercel.app/api/chat", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ message: q })
  });
  const { reply } = await r.json();
  return reply;
}
```

## Sicherheit / DSGVO
- API‑Key liegt nur in der Serverless Function (nicht im Browser).  
- `ALLOWED_ORIGIN` begrenzt CORS auf deine Domain.  
- Keine personenbezogenen Daten protokollieren.  

## System‑Regeln (im Code)
- STRICT LANGUAGE MIRRORING (Antwortsprache = Nutzersprache).  
- Themen: Holger Martens – Fotografie & Bildkunst (Industrie, Event, Hotellerie, Reportage, Fine‑Art).  
- Stil: präzise, professionell, 1–4 Sätze, klassische deutsche Sprache (kein Gendern).  
- Preise: nur grobe Orientierung; konkrete Angebote → Kontakt.  
