# _blank — template scaffold

Copy this folder to start a new template:

```bash
cp -r templates/_blank templates/<your-slug>
```

Then follow the four-stage process in
`skills/landing-page-design-process/SKILL.md`:

1. **Brief & Brand** — fill in `brand/brand.json` (palette, type, and the one
   `styleSignature` sentence that anchors every image). Generate `logo`,
   `logo-mark`, `favicon`, and `style-board`, then fill in `brand/styleguide.html`.
   Use `templates/fishing-course-local-lake/brand/styleguide.html` as the pattern.
2. **Mockup & sales architecture** — build `index.html` + `assets/styles.css`
   with every image declared as a slot in `assets/prompts/manifest.json`.
3. **Asset generation** — run each manifest entry: `styleSignature + subjectPrompt`
   through the engine, then the listed `tools/imgkit.py` post step. Outputs land
   in `assets/img/`; keep full-res originals in `raw/`.
4. **Polish, motion & QA** — apply `DESIGN_GUIDELINES.md`; check 360/768/1280.

See `tools/IMAGE_PIPELINE.md` for engine names, the transparency workflow, and
known issues.

## Shape

```
brand/        brand.json, styleguide.html, logo.png, logo-mark.png, favicon.png, style-board.webp
assets/
  styles.css, script.js
  img/        generated hero/scene/icon/cta assets used by the page
  prompts/    manifest.json (prompt + post step for every asset)
raw/          full-resolution generations kept for re-processing
index.html
```
