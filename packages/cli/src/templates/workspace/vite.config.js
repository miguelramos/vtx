import vue from '@vitejs/plugin-vue';
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import { workspacesAlias } from '@websublime/vtx-common';

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  plugins: [vue(), workspacesAlias('.')],
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())]
    }
  }
});
