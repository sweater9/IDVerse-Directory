# IDVerse Directory

An independent, vendor-neutral directory of identity verification, KYC, KYB, AML, and biometric authentication resources: platforms, open-source tools, sanctions data, standards bodies, and regulations.

Built as a single static page — searchable and filterable by category, no backend required.

Looking for an actual name-screening tool? See [sweater9/AML-Screening](https://github.com/sweater9/AML-Screening) — a separate project.

## Run locally

Open `index.html` directly in a browser, or serve it:

```bash
python3 -m http.server 8000
```

## Deploy on Render

This repo includes a `render.yaml`. In the Render dashboard: **New → Static Site**, connect this repo, and Render will pick up the config automatically (build command empty, publish directory `.`).

## Contributing

Add or edit entries in the `DATA` array in `index.html`. Keep descriptions factual and neutral — no promotional language, no paid placement.

## License

MIT
