# mike.read.us

GitHub Pages-compatible portfolio site for Mike Read.

## Highlights

- Root `index.html` entry point (required for GitHub Pages)
- Modern hero layout with profile photo panel
- Resume-driven cybersecurity content (summary, experience highlights, certifications)
- Clickable icon buttons for LinkedIn and GitHub repo
- No build step required (plain static hosting)

## Profile photo import

Put your real profile image in `assets/` using one of these names (first match is auto-loaded):

- `profile-photo.jpg` (recommended)
- `profile-photo.jpeg`
- `profile-photo.png`
- `profile-photo.webp`
- `profile-photo.svg`

## Run locally

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select your branch (for example `main`) and folder `/ (root)`.
5. Save. GitHub will publish the site from `index.html`.

For custom domain `mike.read.us`, add the domain in Pages settings and configure DNS to GitHub Pages.
