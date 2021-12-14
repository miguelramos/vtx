const { build } = require('esbuild');
const { dependencies } = require('../package.json');

const external = Object.entries(dependencies).map(([key]) => key);

async function buildCommon() {
	return build({
		bundle: true,
		entryPoints: ['index.ts'],
		format: 'cjs',
		write: true,
		platform: 'node',
		outbase: 'src',
		outfile: 'dist/workspace.cjs.js',
		external: [...external, 'esbuild', 'rollup', 'vite']
	});
}

async function buildModule() {
	return build({
		bundle: true,
		entryPoints: ['index.ts'],
		format: 'esm',
		write: true,
		platform: 'node',
		outbase: 'src',
		outfile: 'dist/workspace.esm.js',
		external: [...external, 'esbuild', 'rollup', 'vite']
	});
}

async function buildBundle() {
	await buildCommon();
	await buildModule();
}

buildBundle();
