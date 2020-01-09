import path from "path";

import { ReactGenConfig } from "./config";

/**
 * Create utility functions based on the given configuration.
 * @param config the generator configuration
 */
export const loadUtils = (config: ReactGenConfig) => {
  const { templatePath, basePath } = config;
  /**
   * Create an absolute path to a template file.
   * @param templateFile path to the template file
   */
  const getTemplatePath = (templateFile: string) =>
    path.join(templatePath, templateFile);

  /**
   * Create an absolute path to a location to generate
   * a source file for a part.
   * @param source the path to the part file
   */
  const getPartPath = (source: string) => path.join(basePath, source);

  return {
    getTemplatePath,
    getPartPath
  };
};
