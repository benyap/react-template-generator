const fs = require("fs");
const path = require("path");

/**
 * Check whether a source path is a directory.
 * @param {string} source
 */
const isDirectory = source => fs.lstatSync(source).isDirectory();

/**
 * Get a list of directories at the specified source path.
 * @param {string} source
 */
const getDirectories = source => {
  if (!fs.existsSync(source)) return [];
  return fs
    .readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory);
};

/**
 * Create an abosolute path to a directory in the project from the root directory.
 * @param {string} path
 */
const projectPath = source => path.join(__dirname, `../../../${source}`);

/**
 * Get a list of modules in the project (in app/modules)
 */
const getModules = () =>
  getDirectories(projectPath("app/src/modules")).map(dir => {
    const parts = dir.split(path.sep);
    return parts[parts.length - 1];
  });

/**
 * Get the paths to the different components of a particular part in a module.
 * @param {string} mod the name of the module
 * @param {string} part the name of the part
 */
const getModulePart = (mod, part) =>
  getDirectories(projectPath(`app/src/modules/${mod}/${part}`));

/**
 * Get the paths to the different components of a particular part in all modules.
 * @param {string} part the name of the part
 */
const getParts = part =>
  getModules()
    .map(mod => getModulePart(mod, part))
    .reduce((list, parts) => [...list, ...parts], []);

/**
 * Extract the last segment of a path
 * @param {string} paths a list of paths
 */
const pathTail = p => {
  const pathParts = p.split(path.sep);
  return pathParts[pathParts.length - 1];
};

module.exports = {
  isDirectory,
  getDirectories,
  projectPath,
  getModules,
  getModulePart,
  getParts,
  pathTail
};
