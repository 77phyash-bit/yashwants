# Yashwant — Portfolio (Static Site)

Plain HTML/CSS/JS portfolio. No build step.

## Files
- `index.html` — main page
- `style.css` — all styles (dark/light theme)
- `script.js` — theme toggle + smooth scrolling
- `vercel.json` — Vercel config (clean URLs)
- `.gitignore`

## Deploy on Vercel
1. Create a new GitHub repo and push these files (the **root** of the repo must contain `index.html`).
2. On Vercel: **New Project → Import Git Repository → Deploy**.
3. **Framework Preset:** `Other`
4. **Build Command:** *(leave empty)*
5. **Output Directory:** *(leave empty — root)*
6. Click **Deploy**.

That's it. The 404 you saw earlier happened because the deployed project did not have an `index.html` at the output root. With these files at the root, Vercel serves `index.html` automatically.

## Local preview
Just open `index.html` in a browser, or run:
```
npx serve .
```
