/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

const { build } = require('esbuild');
const { dependencies } = require('../package.json');
const { copy } = require('fs-extra');
const { join, resolve } = require('path');

const external = Object.entries(dependencies).map(([key]) => key);

async function copyReadme() {
	const readme = resolve(join(__dirname, '../../../README.md'));
	const destiny = resolve(join(__dirname, '../dist/README.md'));

	return copy(readme, destiny);
}

async function buildCommon() {
	return build({
		bundle: true,
		entryPoints: ['index.ts'],
		write: true,
		platform: 'node',
		outbase: 'src',
    target: ['node12'],
		outfile: 'dist/common.js',
		external: [...external, 'esbuild', 'rollup', 'vite']
	});
}

async function buildBundle() {
	await buildCommon();
	await copyReadme();
}

buildBundle();
