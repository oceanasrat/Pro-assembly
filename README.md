# Pro Assembly (Vite + React + Tailwind)

This repo contains your landing page component and everything needed to run it locally and push to GitHub.

## Run locally
1) Install Node.js (18+ or 20 recommended)
2) In the project folder:

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages (optional)
If you want GitHub Pages, edit `vite.config.js` and set:

```js
base: "/YOUR_REPO_NAME/"
```

Example if your repo is `pro-assembly`:

```js
base: "/pro-assembly/"
```

Then push to GitHub.

On GitHub:
- Repo → Settings → Pages
- Source: **GitHub Actions**

## Push to GitHub (quick)
```bash
git init
git add .
git commit -m "Initial Pro Assembly landing page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```
