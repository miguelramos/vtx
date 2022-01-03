/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import { build, BuildOptions, createLogger, createServer } from 'vite';
import chalk from 'chalk';

export const viteServer = async (root: string, options: any, httpOptions: any) => {
	try {
		const server = await createServer({
      root,
      base: options.base,
      mode: options.mode,
      configFile: options.config || './vite.config.js',
      logLevel: options.logLevel,
      clearScreen: options.clearScreen,
      server: httpOptions
    });

    if (!server.httpServer) {
      throw new Error('HTTP server not available');
    }

    await server.listen();

    const info = server.config.logger.info

    info(
      chalk.cyan(`\n  vite v${require('vite/package.json').version}`) +
        chalk.green(` dev server running at:\n`),
      {
        clear: !server.config.logger.hasWarned
      }
    )

    server.printUrls()
	} catch(error: any) {
		createLogger(options.logLevel).error(
      chalk.red(`error when starting dev server:\n${error.stack}`),
      { error }
    );

    process.exit(1)
	}
};

export const viteBuild = async (root: string, options: BuildOptions) => {
  console.info(root);

  await build(options);
};