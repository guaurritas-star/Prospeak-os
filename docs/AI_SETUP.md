# ProSpeak OS — Maya AI pilot setup

The published GitHub Pages app has no backend. Never put a Gemini API key in client code, Vite variables, GitHub Pages, commits or public screenshots.

This repository includes a **Vercel Function** at `api/chat.ts` that is disabled by default. Its API key is read only from Vercel server environment variables.

## Enabling a protected pilot

1. Deploy this repository to Vercel with a suitable protected pilot access configuration. Vercel should detect Vite for the frontend and the `api/chat.ts` function for the backend.
2. In Vercel project settings add `GEMINI_API_KEY` as a **secret** environment variable, `PROSPEAK_AI_ENABLED=true`, and `PROSPEAK_ALLOWED_ORIGIN=https://guaurritas-star.github.io` (or the approved app origin). Optionally set `GEMINI_MODEL=gemini-2.5-flash`.
3. On **GitHub Pages**, configure the GitHub Actions build variable `VITE_AI_API_URL` with the deployed Vercel URL ending in `/api/chat` and pass it into the Vite build. It is a public endpoint URL, **never a secret**.
4. Test a simple conversation and a failure case. Confirm the frontend shows AI mode only when the endpoint URL is configured.

**Before enabling for real students:** add authenticated access, robust rate limiting (shared storage, not in-memory only), budget alerts and abuse controls. CORS is a browser control, **not authentication**. Do not expose an unrestricted billed endpoint on a public website.

At present ProSpeak OS defaults safely to **scripted practice** until the backend and endpoint URL are configured. Only messages the student sends while AI mode is enabled leave the browser. No chat history is persisted by the app.

The `VITE_AI_API_URL` value must be a full HTTPS URL trusted by ProSpeak. Do not store tokens or keys in any `VITE_` prefixed variable.
