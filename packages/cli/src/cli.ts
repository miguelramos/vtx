/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import { cac } from 'cac';
import { version } from '../package.json';
import { promptCreateWorkspace, promptCreateApp, promptCreateLib } from './prompt';
import { copy, writeJson, readJson } from 'fs-extra';
import { join, resolve } from 'path';
import { toValidPackageName } from '@websublime/vtx-common';
import { viteBuild, viteServer } from './vite';
import { EOL } from 'os';

const cli = cac('vtx');

function cleanOptions<Options extends Record<string, any>>(
  options: Options
): Omit<Options, keyof Record<string, any>> {
  const ret = { ...options }
  delete ret['--']
  delete ret.c
  delete ret.config
  delete ret.base
  delete ret.l
  delete ret.logLevel
  delete ret.clearScreen
  delete ret.d
  delete ret.debug
  delete ret.f
  delete ret.filter
  delete ret.m
  delete ret.mode
  return ret
}

cli
  .option('-b, --lib <lib>', `[string] use specified lib to build`)
  .option('-p, --app <app>', `[string] use specified app to run`)
  .option('-c, --config <file>', `[string] use specified config file`)
  .option('--base <path>', `[string] public base path (default: /)`)
  .option('-l, --logLevel <level>', `[string] info | warn | error | silent`)
  .option('--clearScreen', `[boolean] allow/disable clear screen when logging`)
  .option('-d, --debug [feat]', `[string | boolean] show debug logs`)
  .option('-f, --filter <filter>', `[string] filter debug logs`)
  .option('-m, --mode <mode>', `[string] set env mode`);

cli.command('[root]')
  .alias('serve') // the command is called 'serve' in Vite's API
  .alias('dev')
  .option('--host [host]', `[string] specify hostname`)
  .option('--port <port>', `[number] specify port`)
  .option('--https', `[boolean] use TLS + HTTP/2`)
  .option('--open [path]', `[boolean | string] open browser on startup`)
  .option('--cors', `[boolean] enable CORS`)
  .option('--strictPort', `[boolean] exit if specified port is already in use`)
  .option(
    '--force',
    `[boolean] force the optimizer to ignore the cache and re-bundle`
  )
  .action(async (root: string, options: any) => {
    const { l, lib, p, app, ...rest } = options;

    const target = root || process.cwd();
    const pkgWorkspace = await readJson(resolve(join(target, './package.json')));

    const [pkg = null] = Object.keys(pkgWorkspace.config.packages).filter(key => key === app);

    const appRoot = pkg ? pkgWorkspace.config.packages[pkg].dir : pkgWorkspace.config.packages[pkgWorkspace.config.default].dir;

    const httpOptions = cleanOptions(JSON.parse(JSON.stringify(rest)));

    await viteServer(appRoot, rest, httpOptions);
  });

cli.command('create-workspace')
  .action(async () => {
    const { target, namespace = '', workspace } = await promptCreateWorkspace();
    const pkg = await readJson(resolve(join(__dirname, './workspace/package.json')));

    const destiny = join(target, toValidPackageName(workspace));

    pkg.name = toValidPackageName(workspace);
    pkg.config.namespace = namespace;
    pkg.config.root = destiny;

    await copy(resolve(join(__dirname, './workspace')), destiny, { recursive: true });
    await writeJson(join(destiny, 'package.json'), pkg, { encoding: 'utf8', spaces: 2, EOL });
  });

cli.command('create-app')
  .action(async () => {
    const { app, target = process.cwd() } = await promptCreateApp();
    const pkg = await readJson(resolve(join(__dirname, './application/package.json')));
    const tsconfig = await readJson(resolve(join(__dirname, './application/tsconfig.json')));
    const pkgWorkspace = await readJson(resolve(join(target, './package.json')));

    const { namespace = '' } = pkgWorkspace.config;

    const hasNamespace = namespace.length > 0;
    const name = hasNamespace ? `${namespace}/${toValidPackageName(app)}` : toValidPackageName(app);

    pkg.name = name;

    if(!Object.entries(pkgWorkspace.config.packages).length) {
      pkgWorkspace.config.default = toValidPackageName(app);
    }

    const destiny = join(target, './apps', toValidPackageName(app));

    pkgWorkspace.config.packages = {
      ...pkgWorkspace.config.packages,
      [toValidPackageName(app)]: {
        name: toValidPackageName(app),
        namespace: name,
        dir: destiny,
        type: 'application'
      }
    };

    tsconfig.paths = {
      ...tsconfig.paths,
      [hasNamespace ? `${name}/*` : `@/${name}/*`]: ['./src/*']
    };

    await copy(resolve(join(__dirname, './application')), destiny, { recursive: true });
    await writeJson(join(destiny, 'package.json'), pkg, { encoding: 'utf8', spaces: 2, EOL });
    await writeJson(join(destiny, 'tsconfig.json'), tsconfig, { encoding: 'utf8', spaces: 2, EOL });
    await writeJson(join(target, 'package.json'), pkgWorkspace, { encoding: 'utf8', spaces: 2, EOL });
  });

cli.command('create-lib')
  .action(async () => {
    const { lib, namespace = '', target = process.cwd() } = await promptCreateLib();
    const pkg = await readJson(resolve(join(__dirname, './lib/package.json')));
    const tsconfig = await readJson(resolve(join(__dirname, './lib/tsconfig.json')));
    const pkgWorkspace = await readJson(resolve(join(target, './package.json')));

    const hasNamespace = namespace.length > 0;
    const name = hasNamespace ? `${namespace}/${toValidPackageName(lib)}` : toValidPackageName(lib);

    pkg.name = name;

    const destiny = join(target, './libs', toValidPackageName(lib));

    pkgWorkspace.config.packages = {
      ...pkgWorkspace.config.packages,
      [toValidPackageName(lib)]: {
        name: toValidPackageName(lib),
        namespace: name,
        dir: destiny,
        type: 'lib'
      }
    };

    tsconfig.paths = {
      ...tsconfig.paths,
      [hasNamespace ? `${name}/*` : `@/${name}/*`]: ['./src/*']
    };

    await copy(resolve(join(__dirname, './lib')), destiny, { recursive: true });
    await writeJson(join(destiny, 'package.json'), pkg, { encoding: 'utf8', spaces: 2, EOL });
    await writeJson(join(destiny, 'tsconfig.json'), tsconfig, { encoding: 'utf8', spaces: 2, EOL });
    await writeJson(join(target, 'package.json'), pkgWorkspace, { encoding: 'utf8', spaces: 2, EOL });
  });

cli.command('build [root]')
  .option('--target <target>', `[string] transpile target (default: 'modules')`)
  .option('--outDir <dir>', `[string] output directory (default: dist)`)
  .option(
    '--assetsDir <dir>',
    `[string] directory under outDir to place assets in (default: _assets)`
  )
  .option(
    '--assetsInlineLimit <number>',
    `[number] static asset base64 inline threshold in bytes (default: 4096)`
  )
  .option(
    '--ssr [entry]',
    `[string] build specified entry for server-side rendering`
  )
  .option(
    '--sourcemap',
    `[boolean] output source maps for build (default: false)`
  )
  .option(
    '--minify [minifier]',
    `[boolean | "terser" | "esbuild"] enable/disable minification, ` +
      `or specify minifier to use (default: esbuild)`
  )
  .option('--manifest', `[boolean] emit build manifest json`)
  .option('--ssrManifest', `[boolean] emit ssr manifest json`)
  .option(
    '--emptyOutDir',
    `[boolean] force empty outDir when it's outside of root`
  )
  .option('-w, --watch', `[boolean] rebuilds when modules have changed on disk`)
  .action(async (root: string, options: any) => {
    const target = root || process.cwd();
    const { lib = null, app = null, ...rest } = options;

    if(!lib && !app) {
      console.error('Please define which app or lib to build!');
      process.exit(1);
    }

    const name: string = app || lib;
    const pkgWorkspace = await readJson(resolve(join(target, './package.json')));

    const entry = Object.entries(pkgWorkspace.config.packages).find(([key]) => key === name);

    if(!entry || !entry.length) {
      console.error(`The ${name} is not defined on vtx config.`);
      process.exit(1);
    }

    const [_, value] = entry as [string, Record<string, string>];
    const isLib = value.type === 'lib';
    const pkg = await readJson(resolve(join(value.dir, './package.json')));

    let buildOptions = JSON.parse(JSON.stringify(rest));

    if(isLib) {
      buildOptions = {
        ...buildOptions,
        lib: {
          entry: resolve(join(value.dir, pkg.source)),
          fileName: (format: string) => `${value.name}.${format}.js`,
          name: value.name
        },
        rollupOptions: pkg.config.rollupOptions
      };
    }

    await viteBuild(value.dir, options, buildOptions);
  });

cli.help();
cli.version(version);

cli.parse();
