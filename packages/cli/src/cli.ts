import { cac } from 'cac';
import { version } from '../package.json';

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

cli.command('create [root]')
  .action((root: string, options) => {
    console.log({root, options});
  });

cli.help();
cli.version(version);

cli.parse();
