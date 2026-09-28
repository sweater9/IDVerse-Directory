# IDVerse Directory

An independent, vendor-neutral directory of identity verification, KYC, KYB, AML, and biometric authentication resources: platforms, open-source tools, sanctions data, standards bodies, and regulations.

Also includes a **name-screening tool** (`/screen.html`) that checks a name against the free public sources it can reach:

- **Live-checked via a real API:** OFAC Specially Designated Nationals list, UN Security Council Consolidated List, INTERPOL Red Notices (public view), GLEIF Global LEI Index, SEC EDGAR Full-Text Search, OpenCorporates, UK Sanctions List (OFSI/FCDO)
- **Live-checked via best-effort scraping:** OpenSanctions public search
- **Manual-link fallback** (no public API, bot-protected, or login-gated): EU Sanctions Map, World Bank Debarred Firms, UK Companies House, ICIJ Offshore Leaks, FinCEN Enforcement Actions, dilisense, PepChecker

This is an informational aggregator, not a compliance determination — verify any hit against the source directly before acting on it. Scraped/API sources can change layout or rate-limit; the tool degrades that source to an error state rather than showing a false result.

## Run locally

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

## Deploy on Render

This repo includes a `render.yaml` configured as a **Node web service** (not a static site — the screening tool needs a server to call the upstream sources, most of which block browser-side CORS requests). In the Render dashboard: **New → Web Service**, connect this repo, and Render will pick up the build/start commands automatically.

## Project layout

- `public/index.html` — the resource directory (static)
- `public/screen.html` — the name-screening UI
- `server/server.js` — Express app serving `public/` and the `/api/screen` endpoint
- `server/sources/*.js` — one module per data source
- `server/screen.js` — aggregates all sources, runs them in parallel, handles per-source failures gracefully

## Contributing

Add or edit directory entries in the `DATA` array in `public/index.html`. Add a new screening source by creating a module in `server/sources/` (see existing ones for the shape) and wiring it into `server/screen.js`. Keep descriptions factual and neutral — no promotional language, no paid placement.

## License

MIT
