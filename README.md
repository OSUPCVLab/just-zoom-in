# Just Zoom In — project page

Static project page for **Just Zoom In: Cross-View Geo-Localization via Autoregressive Zooming** (CVPR 2026 submission).

Authors: Yunus Talha Erzurumlu, Jiyong Kwag, Alper Yilmaz — The Ohio State University.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy on GitHub Pages

Two common options:

1. **Project Pages from `/docs`** — push the contents of this folder into a `docs/` directory on an existing repo's default branch, then in repo settings enable Pages → Source: `main` branch, folder `/docs`.
2. **Project Pages from a `gh-pages` branch** — push this folder as the root of a `gh-pages` branch on any repo, then enable Pages → Source: `gh-pages` branch.

The page is fully static — no build step.

## Updating

- Page content: `index.html`
- Styles: `static/css/style.css`
- Behavior (BibTeX copy): `static/js/main.js`
- Figures: `static/images/`
- Zoom-demo assets: `static/images/zoom/`
