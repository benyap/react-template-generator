import { NodePlopAPI } from "node-plop";
import chalk from "chalk";
import ora from "ora";

import { out } from "../out";

/**
 * Run a template generator.
 * @param plop the plop instance to load generators into
 * @param name the name of the requested generator
 */
export default (plop: NodePlopAPI, name: string) => {
  // Get a list of generators
  const generators = plop.getGeneratorList().map(v => v.name);

  if (!generators.length) {
    // No generators available
    out.error("No generators available.");
    process.exit(1);
  } else if (!name) {
    if (generators.length === 1) {
      // Only one generator available, so run that one
      runGenerator(plop, generators[0]);
    } else {
      out.error(
        `No generator name given. Use one of [${generators.join(", ")}]`
      );
      process.exit(1);
    }
  } else if (generators.includes(name)) {
    // Run the selected generator
    runGenerator(plop, name);
  } else {
    // The requested generator doesn't exist
    out.error(`The generator "${name}" was not found.`);
    process.exit(1);
  }
};

/**
 * Select the generator by name and run it.
 */
const runGenerator = (plop: NodePlopAPI, name: string) => {
  const generator = plop.getGenerator(name);
  out.info(`Running the "${name}" generator.`);
  out.info(`---`);

  // Runs the generator.
  // See https://github.com/plopjs/plop/blob/master/src/plop.js
  (generator as any)
    .runPrompts()
    .then((answers: any) => {
      const progress = ora();

      const typeDisplay = {
        function: chalk.yellow("->"),
        add: chalk.green("++"),
        addMany: chalk.green("+!"),
        modify: `${chalk.green("+")}${chalk.red("-")}`,
        append: chalk.green("_+")
      };

      const onComment = (msg: string) => {
        progress.info(msg);
        progress.start();
      };

      const onSuccess = (change: {
        type: "function" | "add" | "addMany" | "modify" | "append";
        path: string;
        error: string;
      }) => {
        let line = "";
        if (change.type) {
          line += ` ${typeDisplay[change.type]}`;
        }
        if (change.path) {
          line += ` ${change.path}`;
        }
        progress.succeed(line);
        progress.start();
      };

      const onFailure = (fail: {
        type: "function" | "add" | "addMany" | "modify" | "append";
        path: string;
        error: string;
        message: string;
      }) => {
        let line = "";
        if (fail.type) {
          line += ` ${typeDisplay[fail.type]}`;
        }
        if (fail.path) {
          line += ` ${fail.path}`;
        }
        const errMsg = fail.error || fail.message;
        if (errMsg) {
          line += ` ${errMsg}`;
        }
        progress.fail(line);
        progress.start();
      };

      progress.start();

      return (generator as any)
        .runActions(answers, { onSuccess, onFailure, onComment })
        .then(() => progress.stop());
    })
    .catch((err: Error) => {
      out.error(err.message);
      process.exit(1);
    });
};
