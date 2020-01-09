import { NodePlopAPI } from "node-plop";

import { out } from "../out";
import { ReactGenConfig } from "../config";

/**
 * List out all recognised generators.
 * @param plop the plop instance to load generators into
 * @param config the parsed user configuration
 */
export default (plop: NodePlopAPI, config: ReactGenConfig) => {
  // Get list of generators
  const generators = plop.getGeneratorList().map(v => v.name);

  // Print summary
  out.info(
    `${generators.length} generator${
      generators.length === 1 ? "" : "s"
    } available.`
  );

  // Print info about each generator
  generators.forEach(name => {
    const files = (config.parts[name].templates || []).length;
    out.info(`* ${name} (generates ${files} file${files === 0 ? "" : "s"})`);
  });
};
