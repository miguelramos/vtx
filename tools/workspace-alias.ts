const path = require("path");
const fs = require("fs");

export function workspacesAlias(...rootPaths) {
  return {
    name: "vite-plugin-workspace-alias",

    config: (userConfig) => {
      const { alias = {} } = userConfig.resolve || {};

      const modifiedConfig = {
        ...userConfig,
        resolve: {
          alias: {
            ...Object.fromEntries(
              rootPaths
                .flatMap((rootPath) => getPackages(rootPath))
                .map((pkg) => [pkg.name, path.join(pkg.name, pkg.source)])
            ),
            ...alias,
          },
        }

      };

      console.log("Automatic aliases:", modifiedConfig.alias);

      return modifiedConfig;
    },
  };
};

export function getPackages(rootPath, complete = false) {

  const rootPkg = require(path.resolve(
    process.cwd(),
    rootPath.includes("/*") ? rootPath.replace("/*", "") : rootPath,
    "package.json"
  ));

  const { workspaces = [] } = rootPkg || {};

  const folders = workspaces.flatMap((workspace) => {
    if (workspace.includes("/*")) {
      const folderWithWorkspaces = workspace.replace("/*", "");
      const workspacesFolders = fs.readdirSync(
        path.resolve(process.cwd(), rootPath, folderWithWorkspaces)
      );
      return workspacesFolders.map((folderName) =>
        path.join(folderWithWorkspaces, folderName)
      );
    }
    return workspace;
  });

  const folderPaths = folders.map((folder) =>
    path.resolve(process.cwd(), rootPath, folder)
  );

  const packages = folderPaths
    .map((folderPath) => require(path.resolve(folderPath, "package.json")))
    .filter((pkg) => pkg.source);

  return complete ? [packages, folderPaths] : packages;
}
