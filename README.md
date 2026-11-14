# Projekt L.E.B.E.N. — website

Marketing site for Lisa, the AI life companion. German (default) and English.

Same stack as the Persohap site: Next.js 15 (App Router), React 19, next-intl 4,
TypeScript, one plain stylesheet, fonts self-hosted through `next/font`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # TypeScript + translation parity (de/en)
npm run build && npm start   # production mode: pages are prefetched, navigation is instant
```

`npm run dev` compiles each page the first time it is opened, so clicking through
feels slow there. Judge speed and transitions in production mode.

## Pages

| Page | German | English |
|---|---|---|
| Home | `/de` | `/en` |
| Lisa (who she is, what she does) | `/de/lisa` | `/en/lisa` |
| Method (Talk, Reflect, Act; how to start) | `/de/methode` | `/en/method` |
| Topics (seven occasions) | `/de/themen` | `/en/topics` |
| Pricing | `/de/preise` | `/en/pricing` |
| Safety (boundaries, emergency numbers, data) | `/de/sicherheit` | `/en/safety` |
| About (who is behind it, pilot, roadmap, organisations) | `/de/ueber-uns` | `/en/about` |
| FAQ | `/de/fragen` | `/en/faq` |
| Register (interest form) | `/de/vormerken` | `/en/register` |
| Legal notice, privacy | `/de/impressum`, `/de/datenschutz` | `/en/legal-notice`, `/en/privacy` |

## Where things live

- `messages/<locale>/pages.json` — all page copy, one block per page
- `messages/<locale>/common.json` — header, footer, buttons, the form
- `lib/site-config.ts` — everything that must be filled in before going live
- `public/lisa.mp4`, `public/lisa.jpg` — the clip of Lisa speaking and its first frame; replace both to change who plays her
- `app/globals.css` — the whole design system

## Before going live

1. Set the environment variables in `.env.example` (domain, contact address, mail delivery).
2. Complete the provider details in `lib/site-config.ts` (`LEGAL`), have the legal notice and
   privacy page reviewed, then set `LEGAL_DRAFT = false`.
3. Confirm the clip used for Lisa (`public/lisa.mp4`) is the final, licensed one.
4. Once the app exists, set `NEXT_PUBLIC_APP_URL` — every call-to-action button then opens the
   free introduction instead of the interest form.
