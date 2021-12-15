import { createLogger, createServer } from 'vite';
import chalk from 'chalk';

export const viteServer = async (options: any) => {
	try {
		const server = await createServer({
      root: options.root,
      base: options.base,
      mode: options.mode,
      configFile: options.config,
      logLevel: options.logLevel,
      clearScreen: options.clearScreen,
      server: options.http
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