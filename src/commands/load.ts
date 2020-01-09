import { AddActionConfig, NodePlopAPI } from "node-plop";
import inquirer from "inquirer";

import { ReactGenConfig } from "../config";
import { loadUtils } from "../utils";
import { out } from "../out";

/**
 * Load the generators from the user configuration.
 * @param plop the plop instance to load generators into
 * @param config the parsed user configuration
 */
export default (plop: NodePlopAPI, config: ReactGenConfig) => {
  // Load utils
  const utils = loadUtils(config);

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
};
