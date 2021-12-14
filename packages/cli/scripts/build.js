const { build } = require('esbuild');
const { dependencies } = require('../package.json');
const { copy } = require('fs-extra');
const { join, resolve } = require('path');

const external = Object.entries(dependencies).map(([key]) => key);

async function copyTemplates() {
	const src = resolve(join(__dirname, '../src/templates'));
	const destiny = resolve(join(__dirname, '../dist'));

	return copy(src, destiny, { recursive: true });
}

async function buildCli() {
	return build({
		bundle: true,
		entryPoints: ['src/cli.ts'],
		format: 'cjs',
		write: true,
		platform: 'node',
		outbase: 'src',
		outfile: 'dist/cli.js',
		external: [...external, 'esbuild', 'rollup', 'vite']
	});
}

async function buildCommon() {
  return build({
    bundle: true,
    entryPoints: ['index.ts'],
    format: 'cjs',
    write: true,
    platform: 'node',
    outbase: 'src',
    outfile: 'dist/index.cjs.js',
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
		outfile: 'dist/index.esm.js',
		external: [...external, 'esbuild', 'rollup', 'vite']
	});
}

async function buildBundle() {
	await buildCli();
	await copyTemplates();
  // await buildCommon();
	// await buildModule();
}

buildBundle();
