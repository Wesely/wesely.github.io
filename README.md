# Wesely.github.io

Personal website & résumé for **Wesley Weng (翁偉昇)** — Tech Director & Venture Architect.

🔗 Live: https://wesely.github.io/

## What's here

A single-page, bilingual (English / 繁體中文) personal site:

- **Hero & contact** — name, role, one-line positioning, email / phone / LINE
- **By the numbers** — headline metrics
- **About** — combined technical + leadership framing
- **Experience** — Vannise, Grindr (NASDAQ: GRND), BTSE, DeepWave, Blink
- **Career roadmap** — 2012 → 2026 timeline
- **Case study** — Legal AI RAG architecture (Taiwan market)
- **The Venture Collective** — the on-demand execution + advisory squad
- **Education & references**

## Stack

Plain HTML + CSS + vanilla JS. **No build step.** GitHub Pages serves the files directly.

| File | Purpose |
|------|---------|
| `index.html` | Page content (bilingual via `data-lang` attributes) |
| `styles.css` | Styling — clean light / executive theme |
| `script.js` | Language toggle (persisted), scroll reveal, footer year |
| `.nojekyll` | Tell Pages to skip Jekyll processing |

## Editing

- **Text** lives in `index.html`. Every translatable element is duplicated with
  `data-lang="en"` and `data-lang="zh"`; the toggle flips a `lang-en` / `lang-zh`
  class on `<body>` and CSS hides the inactive language. Edit both languages together.
- **Design tokens** (colors, fonts, max width) are CSS variables at the top of `styles.css`.

## Deploy

Pushing to `main` auto-publishes via GitHub Pages (source: `main` branch, root).
