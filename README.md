# ProSpeak OS

An interactive retro-desktop prototype for professional English practice, built with React, TypeScript, Vite and Tailwind CSS.

## Local development

Requires Node.js 22.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (usually http://localhost:3000).

## Publish to GitHub Pages

**The React source files cannot be hosted as-is.** Vite first needs to build the static site. The GitHub Actions workflow in `.github/workflows/deploy-pages.yml` does this and publishes the resulting `dist/` directory automatically.

1. In this repository, open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. On the **Actions** tab, check the **Build and deploy ProSpeak OS** workflow. It runs on commits to `main`; it also checks builds in pull requests.
4. After a successful deployment, the site should be available at **https://guaurritas-star.github.io/Prospeak-os/**.

If the site is blank, open the browser console (F12 → Console) and the workflow logs (Actions). A 404 on JS/CSS assets commonly means an incorrect Vite `base` path.

### Why the Vite base path is conditional

This repository is served from `/Prospeak-os/` on GitHub Pages but from `/` on AI Studio/Cloud Run and local development. The workflow sets `GITHUB_PAGES=true` during the GitHub Pages build so that Vite generates correct asset URLs. Other environments are unchanged.

## Notes

This is a learning prototype. Do not place secret API keys in frontend code, `index.html`, or committed configuration files. Add server-side AI functionality only with appropriate secret management and user privacy safeguards.
