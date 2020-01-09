#!/usr/bin/env node

import v8flags from "v8flags";
import chalk from "chalk";
import ora from "ora";
import minimist from "minimist";

import Liftoff from "liftoff";
import inquirer from "inquirer";
import nodePlop, { NodePlopAPI, AddActionConfig } from "node-plop";

import { getConfig, out, loadUtils } from "./utils";

const Generator = new Liftoff({
  name: "reactgen",
  configName: "reactgenconfig",
  extensions: {
    ".json": null
  },
  v8flags
});

Generator.launch({}, env => {
  out.info("Launching React Templates Generator");

  // Get configuration
  const config = getConfig(env);

  // Load utils
  const utils = loadUtils(config);

  // Create Plop
  const plop = nodePlop("");

  // Load generators from config
  Object.keys(config.parts).forEach(partName => {
    const { description, templates = [], variables = [] } = config.parts[
      partName
    ];

    // Show warnings for generators with no templates
    if (templates.length === 0) {
      out.warning(`The generator "${partName}" produces no templates.`);
    }

    plop.setGenerator(partName, {
      description,
      prompts: variables.map<inquirer.Question>(
        ({ name, message, defaultValue, regex, required, unique }) => {
          return {
            type: "input",
            name,
            default: defaultValue,
            message,
            validate: value => {
              // Ensure a value is given if it is required
              if (required) {
                if (!/.+/.test(value)) {
                  return `A ${name} is required.`;
                }
              }

              // Check if name is unique
              if (unique) {
                const foundIn = utils.partExists(value);
                if (foundIn) {
                  return `A part with the name "${value}" already exists in the `;
                }
              }

              // Check regex if required
              if (regex) {
                if (!new RegExp(regex.regex).test(value)) {
                  return regex.message;
                }
              }

              return true;
            }
          };
        }
      ),
      actions: templates.map<AddActionConfig>(
        ({ path, templateFile, abortOnFail }) => ({
          type: "add",
          path: utils.getPartPath(path),
          templateFile: utils.getTemplatePath(partName, templateFile),
          force: false,
          data: {},
          abortOnFail
        })
      )
    });
  });

  // Parse arguments passed
  const argv = minimist(process.argv.slice(2));
  const generatorName = argv._[0];

  // Get a list of generators
  const generators = plop.getGeneratorList();
  const generatorNames = generators.map(v => v.name);

  if (!generators.length) {
    // No generators available
    out.error("No generators available.");
    process.exit(1);
  } else if (!generatorName) {
    if (generators.length === 1) {
      // Only one generator available, so run that one
      runGenerator(plop, generatorNames[0]);
    } else {
      out.error(
        `No generator name given. Use one of these: [${generators.join(", ")}]`
      );
      process.exit(1);
    }
  } else if (generatorNames.includes(generatorName)) {
    // Run the selected generator
    runGenerator(plop, generatorName);
  } else {
    // The requested generator doesn't exist
    out.error(`The generator "${generatorName}" was not found.`);
    process.exit(1);
  }
});

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
