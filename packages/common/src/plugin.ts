/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import { join } from 'path';
import { getWorkspacePackages } from './utils';

export function workspacesAlias(...rootPaths: string[]) {
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
                .map((pkg) => [pkg.name, join(pkg.name, pkg.source)])
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