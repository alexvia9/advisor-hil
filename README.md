# Advisor HITL (Cabin-style prototype)

React + Vite app: advisor workspace → guardrails → client-facing draft.

## Host on a GitHub URL (GitHub Pages)

Your live site URL will be:

**`https://<your-username>.github.io/<repository-name>/`**

Example: repo `alexvia9/advisor-hil` → `https://alexvia9.github.io/advisor-hil/`

### Deploy checklist (do in order)

1. **Push** this whole project to GitHub on branch **`main`** (or **`master`**), including `.github/workflows/deploy-pages.yml`.
2. **Settings → Actions → General** (left sidebar under “Code and automation”): if a deploy fails with a **permissions** error, set *Workflow permissions* to **Read and write permissions**, save, and re-run the workflow. Many repos work with the default read-only for **contents** because this workflow only uses the `pages: write` permission declared in the YAML.
3. **Settings → Pages**: **Source** = **GitHub Actions**. Do **not** use “Deploy from a branch” for this app. Ignore the Jekyll / Static HTML “Configure” cards unless you have no workflow file yet.
4. **Actions** tab: open **Vite to GitHub Pages** (not Jekyll). Wait for a **green** check. If you previously added a Jekyll workflow, delete it from `.github/workflows/` — it builds an empty site and can overwrite this deploy. If it says **“Waiting for approval”**, open the run → **Review deployments** → approve the **`github-pages`** environment (first time only). You can also remove wait rules under **Settings → Environments → github-pages**.
5. **Settings → Pages** again: copy the site URL (usually `https://<user>.github.io/<repo>/`). Open it in a private window if the cache is sticky.

**Run deploy again without code changes:** **Actions** → **Deploy to GitHub Pages** → **Run workflow** (needs `workflow_dispatch` in the YAML — included here).

### If something fails

| Symptom | What to try |
|--------|-------------|
| Workflow never appears | File must be exactly `.github/workflows/deploy-pages.yml` on the default branch. |
| `npm ci` fails | Run `npm install` locally, commit `package-lock.json`, push. |
| Build ok, deploy fails | Check **Settings → Environments** for `github-pages`; approve pending deployment. |
| **Site is blank (white page)** | Almost always **wrong asset paths**. In the browser: **View Page Source** → if `src="/assets/...` has **no** `/<your-repo>/` before `assets`, push the latest `vite.config.js` and workflow, then re-run Actions. You must open **`https://<user>.github.io/<repo>/`** (include the repo segment). |
| Site is blank / 404 on assets | Repo was renamed? Rebuild so paths match the **current** repo name. |
| Old Jekyll site shows | Delete any other workflow under `.github/workflows/` that mentions Jekyll, and any `_config.yml` you added for that experiment. |

### Local dev

```bash
npm install
npm run dev
```

Local `npm run build` uses `/` as the asset base. CI sets `BASE_URL` to `/<repo>/` automatically.

---

## React + Vite (template notes)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
