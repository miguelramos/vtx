/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

const { build } = require('esbuild');
const { dependencies } = require('../package.json');

const external = Object.entries(dependencies).map(([key]) => key);

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
}

buildBundle();
