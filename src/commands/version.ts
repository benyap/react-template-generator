import pj from "pjson";

import { out } from "../out";

/**
 * Print the current version.
 */
export default () => {
  out.info(`v${pj.version}`);
};
