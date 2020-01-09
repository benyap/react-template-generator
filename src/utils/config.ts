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
   * Use the `modules` substructure. If this is `false`,
   * all generated components will go under the `basePath`
   * directory.
   */
  useModules: boolean;

  /**
   * A configuration for the components that this
   * generator supports.
   */
  parts: {
    [key: string]: PartConfig;
  };
}

export interface PartConfig {
  /**
   * The module that this component should be generated
   * in by default. This value is ignored if `useModules`
   * is `false`.
   */
  module: string;

  /**
   * The name of the folder that this part should be
   * created in.
   */
  folder: string;

  /**
   *
   */
  name: string;
}

/**
 * Get the current configuration. Parsed from the current
 * environment and injects any user customised configuration
 * from a `generatorconfig.js` if it exists.
 * @param env
 */
export const getConfig = (env: Liftoff.LiftoffEnv) => {
  out.debug("Getting config");

  let customConfig: Partial<ReactGenConfig> = {};

  const { configPath, cwd } = env;
  if (configPath) {
    customConfig = JSON.parse(fs.readFileSync(configPath).toString());
  }

  // Create the default config
  const config: ReactGenConfig = {
    root: customConfig.root || cwd,
    basePath: customConfig.basePath || "src/modules",
    useModules:
      typeof customConfig.useModules === "boolean"
        ? customConfig.useModules
        : true,
    parts: {}
  };

  // Get generator parts

  // Return configuration
  out.info(config);
  return config;
};
