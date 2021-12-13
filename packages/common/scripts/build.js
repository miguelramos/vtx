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
		outfile: 'dist/common.cjs.js',
		external
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
		outfile: 'dist/common.esm.js',
		external
	});
}

async function buildBundle() {
	await buildCommon();
	await buildModule();
}

buildBundle();
