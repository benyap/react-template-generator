#!/usr/bin/env node

import v8flags from "v8flags";
import chalk from "chalk";
import ora from "ora";
import minimist from "minimist";

import Liftoff from "liftoff";
import inquirer from "inquirer";
import nodePlop, { NodePlopAPI, AddActionConfig } from "node-plop";

import { getConfig } from "./config";
import { loadUtils } from "./utils";
import { out } from "./out";

/**
 * Create a new Liftoff instance to read and
 * parse environment configuration.
 */
const Generator = new Liftoff({
  name: "reactgen",
  configName: "reactgenconfig",
  extensions: {
    ".json": null
  },
  v8flags
});

/**
 * Launch the application.
 */
Generator.launch({}, env => {
  out.info(`React Template Generator`);

  // Get configuration
  const config = getConfig(env);

  // Load utils
  const utils = loadUtils(config);

  // Create Plop instance
  const plop = nodePlop("");

  // Load generators from config
  Object.keys(config.parts).forEach(generator => {
    const { description, templates = [], variables = [] } = config.parts[
      generator
    ];

    // Show warnings for generators with no templates
    if (templates.length === 0) {
      out.warning(`The generator "${generator}" produces no templates.`);
    }

    // Register the generator with plop
    plop.setGenerator(generator, {
      description,
      // For each required variable, create a prompt
      // in Plop to retrieve it from the user.
      prompts: variables.map<inquirer.Question>(
        ({ name, message, defaultValue, test, optional }) => {
          return {
            type: "input",
            name,
            default: defaultValue,
            message,
            validate: value => {
              // Ensure a value is given if it is not optional
              if (!optional) {
                if (!/.+/.test(value)) {
                  return `A ${name} is required.`;
                }
              }

              // Test the value with a regex if required
              if (test) {
                const result = new RegExp(test.regex).test(value);
                if ((!test.inverted && result) || (test.inverted && !result)) {
                  return test.error;
                }
              }

              return true;
            }
          };
        }
      ),
      // For each template, create a file with an `add` action.
      actions: templates.map<AddActionConfig>(
        ({ path, templateFile, continueOnFail }) => ({
          type: "add",
          path: utils.getPartPath(path),
          templateFile: utils.getTemplatePath(templateFile),
          force: false,
          data: {},
          abortOnFail: !continueOnFail
        })
      )
    });
  });

  // Parse arguments passed
  const argv = minimist(process.argv.slice(2));
  const generatorName = argv._[0];

  // Get a list of generators
  const generators = plop.getGeneratorList().map(v => v.name);

  if (!generators.length) {
    // No generators available
    out.error("No generators available.");
    process.exit(1);
  } else if (!generatorName) {
    if (generators.length === 1) {
      // Only one generator available, so run that one
      runGenerator(plop, generators[0]);
    } else {
      out.error(
        `No generator name given. Use one of [${generators.join(", ")}]`
      );
      process.exit(1);
    }
  } else if (generators.includes(generatorName)) {
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
