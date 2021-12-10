const { build } = require('esbuild');

async function buildCommon() {
	return build({
		bundle: true,
		entryPoints: ['index.ts'],
		format: 'cjs',
		write: true,
		platform: 'node',
		outbase: 'src',
		outfile: 'dist/common.cjs.js',
		external: ['esbuild']
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
		external: ['esbuild']
	});
}

async function buildBundle() {
	await buildCommon();
	await buildModule();
}

buildBundle();