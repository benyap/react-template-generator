#!/usr/bin/env node

const fs = require("fs");
const Liftoff = require("liftoff");
const v8flags = require("v8flags");
const chalk = require("chalk");
const nodePlop = require("node-plop");
const ncp = require("ncp").ncp;

const args = process.argv.slice(2);
const argv = require("minimist")(args);

const loadUtils = require("./utils");

// Import generators
const createComponentGenerator = require("./generators/component");
const createContextGenerator = require("./generators/context");
const createPageGenerator = require("./generators/page");

const Generator = new Liftoff({
  name: "react-typescript-generators",
  configName: "generators-config",
  extensions: {
    ".json": null
  },
  v8flags: v8flags
});

const GEN = {
  error: "[Generator] " + chalk.red.bold("ERROR: "),
  warning: "[Generator] " + chalk.yellow("WARN: "),
  info: "[Generator] " + chalk.blue("INFO: ")
};

Generator.launch({}, env => {
  const { configPath } = env;

  console.log(env);

  // Default configuration
  let config = {
    // rootPath: "../../../",
    rootPath: "./",
    basePath: "app/src/modules",
    templateDir: "./templates",
    componentPaths: {
      component: "{{ camelCase module }}/components",
      context: "{{ camelCase module }}/contexts",
      page: "{{ camelCase module }}/pages"
    },
    componentNames: {
      component: "{{ properCase name }}",
      context: "{{ properCase name }}Context",
      page: "{{ properCase name }}Page"
    }
  };

  // Overwrite configuration if we can read a user provided config file
  if (configPath) {
    try {
      config = JSON.parse(fs.readFileSync(configPath).toString());
    } catch (error) {
      console.error(GEN.error + `Failed to parse config file <${configPath}>.`);
      console.error(GEN.error + error);
      console.warn(GEN.warning + "Using default configuration instead.");
      console.warn(GEN.info + "Using default configuration.");
    }
  } else {
    console.log(GEN.info + "Using default configuration.");
  }

  const generatorName = argv._[0];

  const plop = nodePlop();

  // Load generators
  plop.setGenerator("component", createComponentGenerator(config));
  plop.setGenerator("context", createContextGenerator(config));
  plop.setGenerator("page", createPageGenerator(config));

  const generators = plop.getGeneratorList();
  const generatorNames = generators.map(v => v.name);

  if (!generators.length) {
    // No generators available
    console.error(GEN.error + `No generators available.`);
    process.exit(1);
  } else if (!generatorName && generators.length === 1) {
    if (generators.length === 1) {
      // Only one generator available, so run that one
      runGenerator(config, plop, generatorNames[0]);
    } else {
      console.error(GEN.error + `No generator name given.`);
      process.exit(1);
    }
  } else if (generatorNames.includes(generatorName)) {
    // Run the selected generator
    runGenerator(config, plop, generatorName);
  } else {
    // The requested generator doesn't exist
    console.error(
      GEN.error + `The generator "${generatorName}" was not found.`
    );
    process.exit(1);
  }
});

/**
 * Select the generator by name and run it.
 */
const runGenerator = (config, plop, name) => {
  // Ensure templates are copied over.
  const { isDirectory } = loadUtils(config);
  if (!isDirectory(config.templateDir)) {
    ncp("./templates", config.templateDir, err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      // Run the generator.
      const generator = plop.getGenerator(name);
      generator.runPrompts();
    });
  } else {
    // Run the generator.
    const generator = plop.getGenerator(name);
    generator.runPrompts();
  }
};
