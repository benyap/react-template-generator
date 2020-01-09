import fs from "fs";
import Liftoff from "liftoff";

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
   * A configuration for the parts that this
   * generator can generate.
   */
  parts: {
    [key: string]: PartConfig;
  };
}

export interface PartConfig {
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
  defaultValue?: string;

  /**
   * Make this variable optional. By default, all variables
   * are required.
   */
  optional?: boolean;

  /**
   * If a regular expression is provided, it will be used
   * to check the value of the variable.
   */
  test?: {
    /**
     * The regular expression to use to check.
     */
    regex: string;

    /**
     * The error message if the regular expression fails.
     */
    error: string;

    /**
     * Invert the regex result. By default, an error is
     * thrown if the regex contains a match.
     */
    inverted?: boolean;
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
   * Continue the of the generation process even if this
   * template fails to generate successfully. By default,
   * the process will abort on failure.
   */
  continueOnFail?: boolean;
}

/**
 * Get the current configuration. Parsed from the current
 * environment and injects any user customised configuration
 * from a `generatorconfig.js` if it exists.
 * @param env
 */
export const getConfig = (env: Liftoff.LiftoffEnv) => {
  let customConfig: Partial<ReactGenConfig> = {};

  const { configPath, cwd } = env;

  // Parse config from user provided file if found
  if (configPath) {
    customConfig = JSON.parse(fs.readFileSync(configPath).toString());
  }

  // Create configuration object
  const config: ReactGenConfig = {
    root: customConfig.root || cwd,
    basePath: customConfig.basePath || "src",
    templatePath: customConfig.templatePath || "templates",
    parts: customConfig.parts || {}
  };

  // Return configuration
  return config;
};
