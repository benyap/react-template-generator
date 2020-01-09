import fs from "fs";
import path from "path";

import { ReactGenConfig } from "./config";

/**
 * Create utility functions based on the given configuration.
 * @param config the generator configuration
 */
export const loadUtils = (config: ReactGenConfig) => {
  const { templatePath, basePath } = config;

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
   * Get a list of directories at the specified directory.
   * @param source the path of the directory to list
   */
  const listDirectories = (source: string) => ls(source).filter(isDirectory);

  /**
   * Get a list of files at the specified directory.
   * @param source the path of the directory to list
   */
  const listFiles = (source: string) => ls(source).filter(isFile);

  /**
   * Create an absolute path to a template file.
   * @param partName the name of part
   * @param fileName the name of the template file
   */
  const getTemplatePath = (partName: string, fileName: string) =>
    path.join(templatePath, partName, fileName);

  /**
   * Create an absolute path to a location to generate
   * a source file for a part.
   * @param source the path to the part file
   */
  const getPartPath = (source: string) => path.join(basePath, source);

  /**
   * Check if a part with the given name already exists at the
   * specified location.
   * @param partName the name of the part to check
   * @param folder the name of the folder the part is in
   * @param moduleName the name of the module if modules are used
   */
  const partExists = (partName: string) => {
    // Get a list of items in the folder
    // TODO:
    return "";
  };

  return {
    isDirectory,
    isFile,
    ls,
    listDirectories,
    listFiles,
    getTemplatePath,
    getPartPath,
    partExists
  };
};
