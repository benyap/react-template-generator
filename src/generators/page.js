"use strict";

const { pageExistsIn } = require("../utils/exists");
const { projectPath } = require("../utils");

const pagePath = path =>
  projectPath(
    `app/src/modules/{{ camelCase module }}/pages/{{ properCase name }}Page/${path}`
  );

/**
 * Generate a page in a module.
 */
module.exports = {
  description: "Add a page to a module",
  prompts: [
    {
      type: "input",
      name: "module",
      message:
        "What module should the page be created in? (If the module does not exist, it will be created)",
      default: "core",
      validate: value => {
        if (!/.+/.test(value)) {
          return "A module is required.";
        }
        return true;
      }
    },
    {
      type: "input",
      name: "name",
      message:
        "What should the page be called? ('Page' will be appended to the name)",
      validate: value => {
        if (!/.+/.test(value)) {
          return "A name is required.";
        }

        if (/Page/.test(value)) {
          return 'Do not use "Page" in the name.';
        }

        const mod = pageExistsIn(`${value}Page`);
        if (mod) {
          return `A page with this name already exists in the module "${mod}".`;
        }

        return true;
      }
    }
  ],

  actions: data => {
    // Generate files
    const actions = [
      // Create the index file
      {
        type: "add",
        path: pagePath("index.ts"),
        templateFile: "./page/index.ts.hbs",
        abortOnFail: true
      },
      // Create the source file
      {
        type: "add",
        path: pagePath("{{ properCase name }}Page.tsx"),
        templateFile: "./page/page.tsx.hbs",
        abortOnFail: true
      }
    ];

    return actions;
  }
};
