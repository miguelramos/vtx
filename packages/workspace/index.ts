import { searchForWorkspaceRoot, UserConfig } from 'vite';
import { workspacesAlias, getWorkspacePackagesFolders } from '@vtx/common';

type WorkspaceOptions = {
	aliasDir?: string;
	workspaceRootDir?: string;
	defaultApplication: string;
};

export const defineWorkspace = (config: UserConfig & WorkspaceOptions) => {
	const { plugins = [], server = {}, aliasDir = '.', workspaceRootDir = process.cwd() } = config;
	const { fs = {} } = server;
	const { allow = [] } = fs;

	config.plugins = [
		...plugins,
		workspacesAlias(aliasDir)
	];

	config.server = {
		...server,
		fs: {
			...fs,
			allow: [
				...allow,
				searchForWorkspaceRoot(workspaceRootDir)
			]
		}
	};

	const pkgDirs = getWorkspacePackagesFolders(workspaceRootDir);

	return config;
};