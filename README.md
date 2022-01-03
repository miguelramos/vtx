# VTX Workspace manager for vite

Vtx is an wrapper on vite cli tool to manage multi apps, libs and custom packages on monorepo style focus only with typescript support.

## Dependencies

- Node > 12
- yarn

## Install
Start to install cli as a globals package on your system. Monorepo is managed by yarn so it is mandatory using yarn as your dependency manager.
Install as:

```
yarn global add @websublime/vtx-cli
```

After this you will have binary vtx available as your cli tool.

## Setup
Vtx cli tool can create, serve and build apps or libs. Run vtx --help for more info on the cli tool. 

```
Usage:
  $ vtx [root]

Commands:
  [root]
  create-workspace
  create-app
  create-lib

For more info, run any command with the `--help` flag:
  $ vtx --help
  $ vtx create-workspace --help
  $ vtx create-app --help
  $ vtx create-lib --help

Options:
  --host [host]           [string] specify hostname
  --port <port>           [number] specify port
  --https                 [boolean] use TLS + HTTP/2
  --open [path]           [boolean | string] open browser on startup
  --cors                  [boolean] enable CORS
  --strictPort            [boolean] exit if specified port is already in use
  --force                 [boolean] force the optimizer to ignore the cache and re-bundle
  -b, --lib <lib>         [string] use specified lib to build
  -p, --app <app>         [string] use specified app to run
  -c, --config <file>     [string] use specified config file
  --base <path>           [string] public base path (default: /)
  -l, --logLevel <level>  [string] info | warn | error | silent
  --clearScreen           [boolean] allow/disable clear screen when logging
  -d, --debug [feat]      [string | boolean] show debug logs
  -f, --filter <filter>   [string] filter debug logs
  -m, --mode <mode>       [string] set env mode
  -h, --help              Display this message
  -v, --version           Display version number
```

### Workspace
Start to create a workspace for your apps. Just run:

```
vtx create-workspace
```

And answer to the questions from the cli to config your workspace.

### Vue App
After creating your workspace you are ready to add as many apps as you want. Inside your workspace directory run:

```
vtx create-app
```

And answer the questions to perform your app config.

### Lib
Inside your workspace directory run:

```
vtx create-lib
```

### Run
By default your first app will be the default app to serve. If you want to run a different app just define the name the app you want to run.

```
vtx dev --app my-app
```

Or you can adjust your package.json script to run different apps like:

```
"scripts": {
  "dev": "vtx dev --config ./vite.config.js --debug",
  "dev:ready": "vtx dev --config ./vite.config.js --debug --app ready",
  "build": "vtx build",
  "preview": "vtx preview"
}
```

Vtx supports all options from vite-cli plus --app and --lib.

## TODO

More info about the tool

## Publish

- Run yarn changeset on branch
- Request PR