import { defineConfig, searchForWorkspaceRoot } from 'vite';
import vue from '@vitejs/plugin-vue';
import { workspacesAlias, getPackages } from './tools/workspace-alias';
import { getCommandArguments } from './tools/helpers';

const args = getCommandArguments();
const pkgName = process.env.VITE_NAME;
const [pkgs, paths] = getPackages('.', true);

const pkgIdx = pkgs.findIndex(pkg => pkg.name === pkgName);

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  root: paths[pkgIdx],
  plugins: [vue(), workspacesAlias('.')],
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())],
    }
  }
});
