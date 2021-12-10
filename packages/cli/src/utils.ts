import { join, resolve } from 'path';
import { readdirSync } from 'fs';
import { PackageJson } from './types';

export const getWorkspaceRootPath = () => process.cwd();

export const getCommandArguments = () => {
  return process.argv.slice(2).reduce<Record<string, any>>((acc, arg) => {

    let [key, value = true] = arg.split('=');

    acc[key] = value === undefined ?
      true :
      /true|false/.test(value as string) ?
        value === 'true' :
        /[\d|\.]+/.test(value as string) ?
          Number(value) :
          value;
    return acc

  }, {});
};

export const getWorkspacePackagesFolders = (rootPath: string|null = null) => {
  const root = rootPath || '.';

  const rootPkg: PackageJson = require(resolve(
    process.cwd(),
    root,
    "package.json"
  ));

  const { workspaces = [] }: { workspaces: string[] } = rootPkg || {};

  const folders = workspaces.flatMap((workspace) => {
    if (workspace.includes("/*")) {
      const folderWithWorkspaces = workspace.replace("/*", "");
      const workspacesFolders = readdirSync(
        resolve(process.cwd(), root, folderWithWorkspaces)
      );
      return workspacesFolders.map((folderName) =>
        join(folderWithWorkspaces, folderName)
      );
    }
    return workspace;
  });

  return folders.map((folder) =>
    resolve(process.cwd(), root, folder)
  );
}

export const getWorkspacePackages = (rootPath: string) => {
  const folderPaths = getWorkspacePackagesFolders(rootPath);

  const packages = folderPaths
    .map((folderPath) => require(resolve(folderPath, "package.json")) as PackageJson)
    .filter((pkg) => pkg.source);

  return packages;
}