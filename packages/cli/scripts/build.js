const { build } = require('esbuild');
const { dependencies } = require('../package.json');

const external = Object.entries(dependencies).map(([key]) => key);

async function buildCli() {
	return build({
		bundle: true,
		entryPoints: ['src/cli.ts'],
		format: 'cjs',
		write: true,
		platform: 'node',
		outbase: 'src',
		outfile: 'dist/cli.js',
		external
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
		outfile: 'dist/index.esm.js',
		external
	});
}

async function buildBundle() {
	await buildCli();
  // await buildCommon();
	// await buildModule();
}

buildBundle();
