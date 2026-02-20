# mike.read.us

GitHub Pages-compatible portfolio site for Mike Read.

## Highlights

- Root `index.html` entry point (required for GitHub Pages)
- Modern hero-style design
- Resume snapshot, projects, and contact sections
- No build step required (plain static hosting)

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

If you use the custom domain `mike.read.us`, add it in the Pages settings and point DNS records to GitHub Pages.
