import fs from "fs";
import Liftoff from "liftoff";

import { out } from ".";

/**
 * Schema for the configuration for the generator. This
 * can be overridden with a `reactgenconfig.js` file.
 */
export interface ReactGenConfig {
  /**
   * The path to the project's root folder.
   */
  root: string;

  /**
   * The path to the location where components should be generated.
   */
  basePath: string;

  /**
   * The path to teh location where template files are located.
   */
  templatePath: string;

  /**
   * Use the `modules` substructure. If this is `false`,
   * all generated components will go under the `basePath`
   * directory.
   */
  useModules: boolean;

  /**
   * A configuration for the parts that this
   * generator can generate.
   */
  parts: {
    [key: string]: PartConfig;
  };
}

export interface PartConfig {
  /**
   * The name of the folder that this part should be
   * created in.
   */
  folder: string;

  /**
   * The name of the part. You can use `handlebars` syntax
   * to substitute for user input values requested through
   * `variables`.
   */
  partName: string;

  /**
   * The module that this part should be generated in.
   * If this value is not provided, the part will be
   * generated in the appropriate folder in the base
   * path directory. This value is also ignored if
   * `useModules` is `false`.
   */
  moduleName: string;

  /**
   * The description for the part being generated.
   */
  description: string;

  /**
   * Configure the values to get from the user in
   * order to generate the part.
   */
  variables?: VariableConfig[];

  /**
   * Configure the template files to generate
   * for this part.
   */
  templates?: TemplateConfig[];
}

export interface VariableConfig {
  /**
   * A unique name for the variable being requested.
   * This value can be used as a substitution token
   * when generating components.
   */
  name: string;

  /**
   * The message used to prompt the user for input.
   */
  message: string;

  /**
   * A default value for this variable.
   */
  default?: string;

  /**
   * A value is required from the user if this is `true`.
   *
   * @default true
   */
  required?: boolean;

  /**
   * If this is `true`, the value will be checked
   * that it is unique in the location that it is
   * being created in.
   */
  unique?: true;

  /**
   * If a regular expression is provided, it will be
   */
  regex?: {
    /**
     * The regular expression to use to check.
     */
    regex: string;

    /**
     * The error message if the regular expression fails.
     */
    message: string;
  };
}

export interface TemplateConfig {
  /**
   * The name to give the generated file.
   */
  path: string;

  /**
   * The path to the template file.
   */
  templateFile: string;

  /**
   * Abort the rest of the generation process if this
   * template fails to generate successfully.
   */
  abortOnFail: boolean;
}

/**
 * Get the current configuration. Parsed from the current
 * environment and injects any user customised configuration
 * from a `generatorconfig.js` if it exists.
 * @param env
 */
export const getConfig = (env: Liftoff.LiftoffEnv) => {
  out.debug("Getting config...");

  let customConfig: Partial<ReactGenConfig> = {};

  const { configPath, cwd } = env;
  if (configPath) {
    customConfig = JSON.parse(fs.readFileSync(configPath).toString());
  }

  const useModules =
    typeof customConfig.useModules === "boolean"
      ? customConfig.useModules
      : true;

  // Create the default config
  const config: ReactGenConfig = {
    root: customConfig.root || cwd,
    basePath: customConfig.basePath || useModules ? "src/modules" : "src",
    templatePath: customConfig.templatePath || "templates",
    useModules,
    parts: customConfig.parts || {}
  };

  // Return configuration
  return config;
};
