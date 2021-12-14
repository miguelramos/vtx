import { defineConfig, searchForWorkspaceRoot } from 'vite';
import vue from '@vitejs/plugin-vue';
import { workspacesAlias } from '@vtx/common';

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  plugins: [vue(), workspacesAlias('.')],
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())],
    }
  }
});