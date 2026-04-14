import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * GitHub project Pages URL is https://<user>.github.io/<repo>/
 * Asset paths must be prefixed with /<repo>/ or the browser requests the wrong host path → blank page.
 */
function resolveBase() {
  const explicit = process.env.BASE_URL
  if (explicit && explicit !== 'undefined') {
    return explicit.endsWith('/') ? explicit : `${explicit}/`
  }
  // GitHub Actions sets GITHUB_REPOSITORY=owner/repo for every workflow run
  const ghRepo = process.env.GITHUB_REPOSITORY
  if (ghRepo && process.env.GITHUB_ACTIONS === 'true') {
    const repo = ghRepo.split('/')[1]
    if (repo) return `/${repo}/`
  }
  return '/'
}

// https://vite.dev/config/
export default defineConfig({
  base: resolveBase(),
  plugins: [react(), tailwindcss()],
})
