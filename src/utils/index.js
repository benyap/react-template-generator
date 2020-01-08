const fs = require("fs");
const path = require("path");

module.exports = config => {
  const { basePath, root } = config;

  /**
   * Check whether a source path is a directory.
   * @param {string} source
   */
  const isDirectory = source => fs.lstatSync(source).isDirectory();

  /**
   * Check whether a source path is a file.
   * @param {string} source
   */
  const isFile = source => fs.lstatSync(source).isFile();

  /**
   * Read the object paths in the given directory.
   * @param {string} source
   */
  const readDirectory = source => {
    if (!fs.existsSync(source)) return [];
    return fs
      .readdirSync(source)
      .map(name => path.join(source, name))
      .filter(isFile);
  };

  /**
   * Get a list of directories at the specified source path.
   * @param {string} source
   */
  const getDirectories = source => readDirectory(source).filter(isDirectory);

  /**
   * Get a list of files at the specified source path.
   * @param {string} source
   */
  const getFiles = source => readDirectory(source).filter(isFile);

  /**
   * Create an abosolute path to a directory in the project from the root directory.
   * @param {string} path
   */
  const projectPath = source => path.join(root, source);

  /**
   * Create an absolute path to a template file.
   * @param {string} path
   */
  const templatePath = source => path.join(__dirname, `../templates`, source);

  /**
   * Get a list of modules in the project (in app/modules)
   */
  const getModules = () =>
    getDirectories(projectPath(basePath)).map(dir => {
      const parts = dir.split(path.sep);
      return parts[parts.length - 1];
    });

  /**
   * Get the paths to the different components of a particular part in a module.
   * @param {string} mod the name of the module
   * @param {string} part the name of the part
   */
  const getModulePart = (mod, part) =>
    getDirectories(projectPath(`${basePath}/${mod}/${part}`));

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

  /**
   * Helper function to locate whether a particular
   * thing exists in a specific part of the project.
   * @param {string} part the name of the part
   */
  const existsInPart = part => component => {
    const parts = getParts(part);
    const index = parts.map(pathTail).indexOf(component);
    if (index >= 0) {
      // Extract the name of the module
      const pathParts = parts[index].split(path.sep);
      const moduleIndex = pathParts.indexOf("modules");
      return pathParts[moduleIndex + 1];
    }
    return null;
  };

  /**
   * Check whether a component exists in a module in the project.
   * If it does not exist, `null` will be returned. Otherwise,
   * the name of the module will be returned.
   */
  const componentExistsIn = existsInPart("components");

  /**
   * Check whether a context exists in a module in the project.
   * If it does not exist, `null` will be returned. Otherwise,
   * the name of the module will be returned.
   */
  const contextExistsIn = existsInPart("contexts");

  /**
   * Check whether a page exists in a module in the project.
   * If it does not exist, `null` will be returned. Otherwise,
   * the name of the module will be returned.
   */
  const pageExistsIn = existsInPart("pages");

  return {
    isDirectory,
    isFile,
    getDirectories,
    getFiles,
    projectPath,
    templatePath,
    getModules,
    getModulePart,
    getParts,
    pathTail,
    componentExistsIn,
    contextExistsIn,
    pageExistsIn
  };
};
