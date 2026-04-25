import preact from '@preact/preset-vite';
import { execSync } from 'child_process';
import { defineConfig } from 'vite';

const gitRevision = execSync('git rev-parse --short HEAD').toString().trim();

export default defineConfig(({ mode }) => ({
  server: {
    port: 3000,
    hmr: {
      port: 3001,
      clientPort: 3001,
    },
  },
  resolve: {
    mainFields: mode === 'production' ? ['jsnext:main', 'module', 'main'] : undefined,
  },
  build: {
    outDir: './build',
  },
  define: {
    GIT_COMMIT_SHA: JSON.stringify(gitRevision),
  },
  plugins: [preact()],
}));
