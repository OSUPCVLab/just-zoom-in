# Just Zoom In project website

Minimal static GitHub Pages website for:

**Just Zoom In: Cross-View Geo-Localization via Autoregressive Zooming**

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Editing checklist

- Replace author profile placeholders in `index.html`.
- Update the dataset gallery in `index.html` when adding or removing files from `streetview_samples/`.
- Keep `CITATION.bib` and the BibTeX block in `index.html` in sync if citation metadata changes.

## Animation notes

The zoom demo is implemented with plain JavaScript in `assets/js/main.js`. It cycles through generated street-view and satellite crops in `demo_samples/`. This is intentionally lightweight so it works on GitHub Pages without Node, React, or a build step.

## GitHub Pages

Put `index.html` at the root of the repository and enable GitHub Pages from the repository settings using the `main` branch and `/root` as the publishing source.
