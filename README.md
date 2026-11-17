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

The design pages are the Claude Design markup, stored as `content/<locale>/<page>.html`
(plus `titles.json`), with their artwork in `public/design/` and hover states in
`app/design-hover.css`. `components/DesignPage.tsx` renders the markup; `.dc` in
`app/globals.css` shields it from every other style so only the design applies.
To change a design page, edit its HTML in `content/de/` and `content/en/`.

**Pictures of Lisa and Felix:** Felix is the HeyGen LiveAvatar character "Matthew", Lisa is
"Hannah" (the characters used in the live conversation): `public/design/assets/felix.webp`,
`lisa.webp` (hero), `laptop.webp`, `phone.webp` (call screens).

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
