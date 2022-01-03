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

async function copyReadme() {
	const readme = resolve(join(__dirname, '../../../README.md'));
	const destiny = resolve(join(__dirname, '../dist/README.md'));

	return copy(readme, destiny);
}

async function buildCli() {
	return build({
		bundle: true,
		entryPoints: ['src/cli.ts'],
		write: true,
		platform: 'node',
		outbase: 'src',
		outfile: 'dist/cli.js',
    target: ['node12'],
		external: [...external, 'esbuild', 'rollup', 'vite', 'chalk']
	});
}

async function buildBundle() {
	await buildCli();
	await copyTemplates();
	await copyReadme();
}

buildBundle();
