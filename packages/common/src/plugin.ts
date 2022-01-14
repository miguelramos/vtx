/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import { join } from 'path';
import { PackageJson } from './types';
import { getWorkspacePackages } from './utils';

/**
 * Create alias for vite
 * 
 * @param rootPaths - Root paths to looking for
 * @param exclude - Exclude apps, libs or packages by is package.json name
 */
export function workspacesAlias(rootPaths: string[], exclude: string[] = []) {
  return {
    name: "vite-plugin-workspace-alias",

    config: (userConfig: Record<string, any>) => {
      const { alias = {} } = userConfig.resolve || {};

      const modifiedConfig = {
        ...userConfig,
        resolve: {
          alias: {
            ...Object.fromEntries(
              rootPaths
                .flatMap((rootPath) => getWorkspacePackages(rootPath))
                .filter(([_, pkg]) => !exclude.includes((pkg as PackageJson).name))
                .map(([folder, pkg]) => {
                  const dir = folder as string;
                  const pkgJson = pkg as PackageJson;

                  return [pkgJson.name, join(dir, pkgJson.source)];
                })
            ),
            ...alias,
          },
        }

      };

      console.log("Automatic aliases:", modifiedConfig.resolve.alias);

      return modifiedConfig;
    },
  };
};
