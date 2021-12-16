/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import { cac } from 'cac';
import { version } from '../package.json';
import { promptCreateWorkspace, promptCreateApp } from './prompt';
import { copy, writeJson, readJson } from 'fs-extra';
import { join, resolve } from 'path';
import { toValidPackageName } from '@websublime/vtx-common';
import { viteServer } from './vite';
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
  .option('-l, --lib <lib>', `[string] use specified lib to build`)
  .option('-p, --app <app>', `[string] use specified app to run`);

cli.command('[root]')
  .alias('serve') // the command is called 'serve' in Vite's API
  .alias('dev')
  .allowUnknownOptions()
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

    const pkg = Object.keys(pkgWorkspace.config.packages).filter(key => {
      if(key === app) {
        return pkgWorkspace.config.packages[key];
      }
    }) as Record<string, any>;

    const appRoot = pkg ? pkg.dir : pkgWorkspace.config.packages[pkgWorkspace.config.default].dir;

    rest.root = appRoot;
    rest.http = cleanOptions(rest);

    await viteServer(rest);
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
    const pkgWorkspace = await readJson(resolve(join(target, './package.json')));

    const { namespace = '' } = pkgWorkspace.config;

    const name = namespace.length ? `${namespace}/${toValidPackageName(app)}` : toValidPackageName(app);

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

    await copy(resolve(join(__dirname, './application')), destiny, { recursive: true });
    await writeJson(join(destiny, 'package.json'), pkg, { encoding: 'utf8', spaces: 2, EOL });
    await writeJson(join(target, 'package.json'), pkgWorkspace, { encoding: 'utf8', spaces: 2, EOL });
  });

cli.command('create-lib')
  .action(async () => {
    console.dir('LIB');
  });

cli.help();
cli.version(version);

cli.parse();
