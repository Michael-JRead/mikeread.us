# mikeread.us

Personal portfolio site for Michael Read.

This document is the maintenance guide for future updates so you can quickly change content, visuals, and link previews without breaking deployment.

## Stack and layout

- Frontend: React + Vite + Tailwind CSS
- Package manager: `pnpm` via Corepack
- Source app root: `client/`
- Static Pages output: `dist/public`

Important paths:

- App HTML template: `client/index.html`
- Main content data: `client/src/data/siteContent.ts`
- Global styles: `client/src/index.css`
- Required public assets: `client/public/assets/`
- Pages workflow: `.github/workflows/deploy-pages.yml`

## Local setup

Install dependencies:

```bash
corepack pnpm install --frozen-lockfile
```

Run locally:

```bash
corepack pnpm dev
```

Local preview of production build:

```bash
corepack pnpm build:pages
corepack pnpm preview --host 127.0.0.1 --port 4173
```

## Daily update workflow

Use this checklist whenever updating the site:

1. Pull latest:

```bash
git checkout main
git pull --ff-only origin main
```

2. Make edits (content, styles, assets).
3. Run validation:

```bash
corepack pnpm check
corepack pnpm build:pages
```

4. Smoke test local preview on desktop and mobile width.
5. Commit and push:

```bash
git add -A
git commit -m "Your message"
git push origin main
```

6. Verify GitHub Actions deployment finished successfully.

## Content editing guide

### Primary profile content

Edit:

- `client/src/data/siteContent.ts`

This file controls:

- Name, role, summary
- Social links
- Experience, education, certifications, projects
- Share metadata defaults (title/description/image URL)

### Section-level UI

Edit components under:

- `client/src/components/`

High-impact files:

- `HeroSection.tsx`
- `ExperienceSection.tsx`
- `PortfolioSection.tsx`
- `CertificationsSection.tsx`
- `ContactSection.tsx`

### Global colors and theme

Edit:

- `client/src/index.css`

Current design direction:

- Dark premium background
- Red-accent theme
- Glass-card style

## Required assets

Build will fail if these are missing:

- `client/public/assets/profile-photo.png`

Validation script:

- `scripts/validate-required-assets.mjs`

## Link preview (text-message popup) guide

### Current preview asset and metadata

Current social preview image:

- `client/public/assets/og-preview-v4.jpg`

Metadata source:

- `client/index.html`
- `index.html` (keep in sync to avoid stale previews from root-served contexts)
- `client/src/data/siteContent.ts` (`shareTitle`, `shareDescription`, `shareImageUrl`)

### Required tags for rich preview

Ensure these exist in `client/index.html`:

- `canonical`
- `og:title`, `og:description`, `og:type`, `og:url`, `og:site_name`
- `og:image`, `og:image:secure_url`, `og:image:type`, `og:image:width`, `og:image:height`, `og:image:alt`
- `twitter:card=summary_large_image`
- `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`

### If preview is stale after deploy

Link previews are cached by messaging/social platforms. If old previews persist:

1. Change image filename version (example: `og-preview-v5.jpg`).
2. Update metadata URLs to the new filename.
3. Rebuild and redeploy.
4. Re-share the link (or append a temporary query parameter when testing).

## OG image design standards

For professional mobile text previews:

- Size: `1200x630`
- Keep text minimal (headline + role only)
- Keep face centered with safe top headroom
- High contrast typography
- Avoid dense paragraphs or too many badges

Current approved style:

- Executive portrait on right
- Clean text block on left
- Minimal copy

## Deployment model (GitHub Pages)

Pages must use GitHub Actions deployment (not branch-root publishing).

Workflow:

- `.github/workflows/deploy-pages.yml`

Build command:

- `corepack pnpm build:pages`

Artifact path:

- `dist/public`

### Pages outputs expected each deploy

- `dist/public/index.html`
- `dist/public/404.html`
- `dist/public/CNAME`
- `dist/public/assets/profile-photo.png`
- `dist/public/assets/og-preview-v4.jpg`

## Troubleshooting

### Build warning about `%VITE_ANALYTICS_*%`

If you see warnings from unresolved analytics placeholders, check `index.html`/`client/index.html` for raw `%VITE_*%` tags.

Preferred behavior:

- Only inject analytics script at runtime when env vars exist (already handled in app logic).

### 404 on live site

Check:

1. GitHub Pages source is set to `GitHub Actions`.
2. Latest workflow run succeeded.
3. `CNAME` exists in built artifact.

### UI looks broken only on phone

1. Test locally at mobile viewport before pushing.
2. Re-check touch targets and spacing in affected section.
3. Verify no section-specific background is fighting global background.

## Optional visual QA workflow

Use Playwright screenshots before commit:

```bash
corepack pnpm dlx playwright@1.51.1 screenshot --device="Desktop Chrome" --full-page http://127.0.0.1:4173/ .tmp-visual/desktop.png
corepack pnpm dlx playwright@1.51.1 screenshot --browser=chromium --viewport-size="393,852" --full-page http://127.0.0.1:4173/ .tmp-visual/mobile.png
```

Notes:

- `.tmp-visual/` is local scratch; do not commit it.

## Suggested commit hygiene

- Keep changes scoped per task (content vs theme vs metadata).
- Use clear commit messages:
  - `Refine contact form readability`
  - `Polish OG preview and social metadata`

## Repo quick commands

```bash
# status
git status -sb

# latest commits
git log --oneline --decorate -n 5

# sync local to remote
git fetch origin --prune
git pull --ff-only origin main
```

