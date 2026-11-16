# li-fe.ai — website

Marketing site for li-fe.ai: Lisa & Felix, digital life companions. German (default) and English.

Next.js 15 (App Router), React 19, next-intl 4, TypeScript.

## Run

```bash
npm install
npm run dev                  # http://localhost:3000 (compiles pages on first open, so it feels slow)
npm run build && npm start   # production mode: this is what visitors get
npm run check                # TypeScript + translation parity (de/en)
```

## How the design gets onto the site

The pages are not redrawn by hand. They come from the Claude Design export:

1. Export the project from Claude Design as **Project HTML (.zip)** and unzip it into `design-export/`.
2. Run `node scripts/import-design.mjs`.

That writes `content/<locale>/<page>.html` (the design's own markup), copies the artwork to
`public/design/`, and generates `app/design-hover.css`. `components/DesignPage.tsx` renders the
markup; `.dc` in `app/globals.css` shields it from every other style so only the design applies.

The importer also fills two gaps the export leaves open: the two plans on the pricing page
(Basic 59 €, Plus 99 €) and the footer's legal links.

**Pictures of Lisa and Felix:** they come from the two files in `design-export/uploads/`
(the transparent double portrait and the laptop/phone call mock-up). To change them, replace
those files, run `python scripts/make-portraits.py`, then the importer again.

## Pages

| Page | German | English | Source |
|---|---|---|---|
| Home | `/de` | `/en` | design |
| Lisa & Felix | `/de/lisa` | `/en/lisa` | design |
| How it works | `/de/methode` | `/en/method` | design |
| Topics | `/de/themen` | `/en/topics` | design |
| Pricing | `/de/preise` | `/en/pricing` | design |
| FAQ | `/de/fragen` | `/en/faq` | design |
| Register (interest form) | `/de/vormerken` | `/en/register` | built here |
| Legal notice, privacy | `/de/impressum`, `/de/datenschutz` | `/en/legal-notice`, `/en/privacy` | built here |

Buttons in the design that had no target ("Mit Felix sprechen", "Abo wählen") lead to the register page.

## Before going live

1. Set the environment variables in `.env.example` (domain, contact address, mail delivery).
2. Complete the provider details in `lib/site-config.ts` (`LEGAL`), have the legal notice and
   privacy page reviewed, then set `LEGAL_DRAFT = false`.
3. Confirm the claims the design makes: available 24/7, developed by occupational therapists and
   psychotherapists, GDPR-compliant, conversations never passed on.
4. Confirm the portraits of Lisa and Felix may be used.
