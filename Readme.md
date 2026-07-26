# Mohammed Nadeem Mansoori

Personal site and portfolio for **Mohammed Nadeem Mansoori**, Senior Application
Security Engineer (AppSec, GRC, AI security). ISO/IEC 27001:2022 Lead Auditor and
creator of [VoltPhish](https://github.com/Baymax-armed/Voltphish).

Live site: enable **GitHub Pages** on this repo (Settings > Pages > Source:
`main` / root), then it serves at
`https://baymax-armed.github.io/Mohammed-Nadeem-Mansoori/`.

## Stack

Hand-built static site. No framework, no build step, deploys anywhere.

- `index.html` - content and structure
- `styles.css` - design system (dark canvas, single signal-amber accent)
- `main.js` - nav, scroll reveals (reduced-motion aware), copy-to-clipboard
- `assets/fonts/` - self-hosted Cabinet Grotesk + Satoshi (woff2)
- `assets/img/` - project imagery

## Editing

- **Email / LinkedIn:** open `main.js` and edit the two constants at the top
  (`EMAIL`, `LINKEDIN_URL`). Paste your LinkedIn URL to reveal the LinkedIn button.
- **Content:** everything lives in `index.html`, grouped by section
  (hero, work, focus, certifications, contact).

## Run locally

```bash
python -m http.server 8080
# then open http://localhost:8080
```
