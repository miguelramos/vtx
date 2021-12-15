/**
 * Copyright Websublime All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://websublime.dev/license
 */

import {
	getCommandArguments,
	getWorkspaceRootPath,
	getWorkspacePackages,
	getWorkspacePackagesFolders,
	isValidPackageName,
	toValidPackageName
} from './src/utils';

import { workspacesAlias } from './src/plugin';

export {
	getCommandArguments,
	getWorkspaceRootPath,
	getWorkspacePackages,
	getWorkspacePackagesFolders,
	isValidPackageName,
	toValidPackageName,
	workspacesAlias
};