/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

export type PackageJson = {
	dependencies: Record<string, string>;
	devDependencies: Record<string, string>;
	license: string;
	name: string;
	private: boolean;
	scripts: Record<string, string>;
	source: string;
	version: string;
	workspaces: string[];
  author: Record<string, string>;
  bin: Record<string, string>;
  config: Record<string, string>;
  email: string;
  exports: Record<string, { import: string, require: string }>;
  files: string[];
  main: string;
  module: string;
  types: string;
  url: string;
};