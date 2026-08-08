# Anong Thai-Massage

Moderne, elegante One-Page-Website für Anong Thai-Massage, einen traditionellen Thai-Massagesalon in Reutlingen. Enthält Leistungsübersicht, Preistabelle, Netlify-Forms-Buchungsformular, Öffnungszeiten, Kontakt und Standort.

## Run & Operate

- `pnpm --filter @workspace/anong-thai run dev` — Website starten (Port via $PORT)
- `pnpm run typecheck` — TypeScript-Check über alle Pakete
- `pnpm run build` — Typecheck + Build aller Pakete

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, Framer Motion
- Fonts: Cormorant Garamond (Überschriften), Inter (Fließtext) via Google Fonts
- Routing: Wouter (/, /impressum, /datenschutz)
- Buchungsformular: Netlify Forms (data-netlify="true", kein eigenes Backend)

## Where things live

- `artifacts/anong-thai/src/pages/home.tsx` — Hauptseite (alle Sektionen: Hero, Über uns, Anwendungen, Preise, Buchung, Öffnungszeiten, Kontakt)
- `artifacts/anong-thai/src/pages/impressum.tsx` — Impressum (Platzhalter)
- `artifacts/anong-thai/src/pages/datenschutz.tsx` — Datenschutz (Platzhalter)
- `artifacts/anong-thai/src/App.tsx` — Router-Setup (wouter)
- `artifacts/anong-thai/src/index.css` — CSS-Theme (warme erdige Palette)
- `artifacts/anong-thai/index.html` — Enthält versteckte Netlify-Form-Definition
- `attached_assets/anong_logo.jpg` — Logo-Bild (importiert via @assets alias)

## Architecture decisions

- Statische Frontend-App ohne eigenes Backend — Buchungsformular läuft über Netlify Forms
- Netlify Forms: versteckte HTML-Form in index.html für Netlify-Crawler-Erkennung, React-Formular sendet via fetch mit URLSearchParams-Encoding
- Dienstag ist als Ruhetag implementiert (Datepicker disabled, Zeitslots leer)
- Zeitslots werden dynamisch basierend auf Wochentag berechnet (Mo/Mi–Sa 10–20 Uhr, So 10–19 Uhr)

## Product

One-Page-Website mit Anchor-Navigation für Anong Thai-Massage Reutlingen:
- Sticky transparenter Header mit Logo und "Termin buchen"-Button
- Hero-Sektion mit KI-generiertem Bild
- Über-uns mit warmem Willkommenstext
- Anwendungen-Karten (10 Behandlungen)
- Preistabelle (gruppiert nach Behandlung)
- Buchungsformular (Netlify Forms, keine Dienstag-Termine, korrekte Zeitslots)
- Öffnungszeiten (heute hervorgehoben)
- Kontakt + Google Maps
- Footer + Impressum/Datenschutz-Platzhalterseiten

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Template-Literal-Interpolationen (\${}) dürfen in tsx-Dateien NICHT escaped werden (\${}) — Babel lehnt \${ ab
- Netlify Forms benötigt beim Deploy auf Netlify eine statische Form-Definition in index.html (bereits vorhanden)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
