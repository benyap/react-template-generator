import fs from "fs";
import path from "path";

import { ReactGenConfig } from "./config";

/**
 * Create utility functions based on the given configuration.
 * @param config the generator configuration
 */
export const loadUtils = (config: ReactGenConfig) => {
  const { templatePath } = config;

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
   * Create an absolute path to a template file.
   * @param {string} path
   */
  const getTemplatePath = (source: string) => path.join(templatePath, source);

  return {
    isDirectory,
    isFile,
    ls,
    listDirectories,
    listFiles,
    getTemplatePath
  };
};
