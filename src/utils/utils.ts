import fs from "fs";
import path from "path";

import { ReactGenConfig } from "./config";

/**
 * Create utility functions based on the given configuration.
 * @param config the generator configuration
 */
export const loadUtils = (config: ReactGenConfig) => {
  const { root, basePath } = config;

  /**
   * Check whether a source path is a directory.
   * @param source the source path to check
   */
  const isDirectory = (source: string) => fs.lstatSync(source).isDirectory();

  /**
   * Check whether a source path is a file.
   * @param source the source path to check
   */
  const isFile = (source: string) => fs.lstatSync(source).isFile();

  /**
   * List the paths in the given directory. Returns an
   * empty array if the given directory does not exist.
   * @param source the source path to check.
   */
  const ls = (source: string) => {
    if (!fs.existsSync(source)) return [];
    return fs
      .readdirSync(source)
      .map(name => path.join(source, name))
      .filter(isFile);
  };

  /**
   * Get a list of directories at the specified source path.
   * @param source the source path to list
   */
  const listDirectories = (source: string) => ls(source).filter(isDirectory);

  /**
   * Get a list of files at the specified source path.
   * @param source the source path to list
   */
  const listFiles = (source: string) => ls(source).filter(isFile);

  /**
   * Create an abosolute path to a directory in the project from the root directory.
   * @param {string} source
   */
  const projectPath = (source: string) => path.join(root, source);

  /**
   * Create an absolute path to a template file.
   * @param {string} path
   */
  const templatePath = (source: string) =>
    path.join(__dirname, `../templates`, source);

  /**
   * Get a list of modules in the project (in app/modules)
   */
  const getModules = () =>
    listDirectories(projectPath(basePath)).map(dir => {
      const parts = dir.split(path.sep);
      return parts[parts.length - 1];
    });

  /**
   * Get the paths to the different components of a particular part in a module.
   * @param {string} mod the name of the module
   * @param {string} part the name of the part
   */
  const getModulePart = (mod: string, part: string) =>
    listDirectories(projectPath(`${basePath}/${mod}/${part}`));

  /**
   * Get the paths to the different components of a particular part in all modules.
   * @param {string} part the name of the part
   */
  const getParts = (part: string) =>
    getModules()
      .map(mod => getModulePart(mod, part))
      .reduce((list, parts) => [...list, ...parts], []);

  /**
   * Extract the last segment of a path
   * @param {string} paths a list of paths
   */
  const pathTail = (paths: string) => {
    const pathParts = paths.split(path.sep);
    return pathParts[pathParts.length - 1];
  };

  /**
   * Helper function to locate whether a particular
   * thing exists in a specific part of the project.
   * @param {string} part the name of the part
   */
  const existsInPart = (part: string) => (component: string) => {
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
};
