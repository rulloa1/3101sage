import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Hostnames allowed to hit the dev server, supplied per environment (e.g. the
// cloud preview hostname) so no machine-specific host is committed to the repo.
// Deliberately NOT prefixed with VITE_: this is server-side dev config, not a
// client-exposed value. VITE_ALLOWED_HOSTS is still read for older run commands.
const rawAllowedHosts = process.env.PREVIEW_ALLOWED_HOSTS || process.env.VITE_ALLOWED_HOSTS || '';

const extraAllowedHosts = rawAllowedHosts
  .split(',')
  .map((host) => host.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, ''))
  .filter(Boolean);

export default defineConfig({
  plugins: [react()],
  base: './',
  server: extraAllowedHosts.length > 0 ? { allowedHosts: extraAllowedHosts } : {},
  build: {
    outDir: 'dist',
  },
});
