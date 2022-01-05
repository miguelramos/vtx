/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

export interface CliOptions {
  '--'?: string[];
  app?: string;
  p?: string;
  lib?: string;
  b?: string;
  c?: boolean | string;
  config?: string;
  base?: string;
  l?: 'error' | 'warn' | 'info' | 'silent';
  logLevel?: 'error' | 'warn' | 'info' | 'silent';
  clearScreen?: boolean;
  d?: boolean | string;
  debug?: boolean | string;
  f?: string;
  filter?: string;
  m?: string;
  mode?: string;
}

export interface CliDevOptions extends CliOptions {
  host?: string;
  port?: number;
  https?: boolean;
  open?: boolean|string;
  cors?: boolean;
  strictPort?: boolean;
  force?: boolean;
}

export interface CliBuildOptions extends CliOptions {
  target?: string;
  outDir?: string;
  assetsDir?: string;
  assetsInlineLimit?: number;
  ssr?: string;
  sourcemap?: boolean;
  minify?: boolean | string;
  manifest?: boolean;
  ssrManifest?: boolean;
  emptyOutDir?: boolean;
  watch?: boolean;
  w?: boolean;
}

export interface PackageJsonConfig {
  packages: Record<string, {
    name: string;
    namespace: string;
    dir: string;
    type: 'application'|'lib';
  }>;
  default: string;
  namespace: string;
  root: string;
}
