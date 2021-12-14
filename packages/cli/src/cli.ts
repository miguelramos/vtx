import { cac } from 'cac';
import { version } from '../package.json';
import { promptCreateWorkspace, promptCreateApp } from './prompt';
import { copy, writeFile, readJson } from 'fs-extra';
import { join, resolve } from 'path';
import { toValidPackageName } from '@vtx/common';

const cli = cac('vtx');

cli
  .option('-c, --config <file>', `[string] use specified config file`)
  .option('-p, --app <app>', `[string] use specified app to run`);

cli.command('[root]')
  .alias('serve') // the command is called 'serve' in Vite's API
  .alias('dev')
  .action((root: string, options: any) => {
    console.log({root, options});
  });

cli.command('create-workspace')
  .action(async () => {
    const { target, workspace } = await promptCreateWorkspace();
    const pkg = await readJson(resolve(join(__dirname, './workspace/package.json')));

    pkg.name = toValidPackageName(workspace);

    const destiny = join(target, toValidPackageName(workspace));

    await copy(resolve(join(__dirname, './workspace')), destiny, { recursive: true });
    await writeFile(join(destiny, 'package.json'), JSON.stringify(pkg), { encoding: 'utf8' });
  });

cli.command('create-app')
  .action(async () => {
    const { app, namespace = '', target = process.cwd() } = await promptCreateApp();
    const pkg = await readJson(resolve(join(__dirname, './application/package.json')));

    const name = namespace.length ? `${namespace}/${toValidPackageName(app)}` : toValidPackageName(app);

    pkg.name = name;

    const destiny = join(target, './apps', toValidPackageName(app));

    await copy(resolve(join(__dirname, './application')), destiny, { recursive: true });
    await writeFile(join(destiny, 'package.json'), JSON.stringify(pkg), { encoding: 'utf8' });
  });

cli.command('create-lib')
  .action(async () => {
    console.dir('LIB');
  });

cli.help();
cli.version(version);

cli.parse();
