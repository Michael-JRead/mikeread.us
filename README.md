# mikeread.us

Mike Read portfolio site.

## GitHub Pages deployment

- GitHub Pages source must be set to `GitHub Actions` (not `main/(root)`).
- Workflow file: `.github/workflows/deploy-pages.yml`.
- Static output path: `dist/public`.
- Build command for Pages: `corepack pnpm build:pages`.

## Required assets

The build validates required assets before generating output:

- `client/public/assets/profile-photo.png`
- `client/public/assets/MichaelReadResumeFeb2026.pdf`

Validation script:

- `scripts/validate-required-assets.mjs`

## Routing fallback

- `scripts/postbuild-pages.mjs` copies `dist/public/index.html` to `dist/public/404.html` for SPA fallback handling on GitHub Pages.
