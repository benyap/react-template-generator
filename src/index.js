#!/usr/bin/env node

const fs = require("fs");
const Liftoff = require("liftoff");
const v8flags = require("v8flags");
const chalk = require("chalk");
const nodePlop = require("node-plop");

const args = process.argv.slice(2);
const argv = require("minimist")(args);

// Import generators
const { generateComponentConfig } = require("./generators/component");
const { generateContextConfig } = require("./generators/context");
const { generatePageConfig } = require("./generators/page");

// Import templates

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
  plop.setGenerator("component", generateComponentConfig(config));
  plop.setGenerator("context", generateContextConfig(config));
  plop.setGenerator("page", generatePageConfig(config));

  const generators = plop.getGeneratorList();
  const generatorNames = generators.map(v => v.name);

  if (!generators.length) {
    // No generators available
    console.error(GEN.error + `No generators available.`);
    process.exit(1);
  } else if (!generatorName && generators.length === 1) {
    if (generators.length === 1) {
      // Only one generator available, so run that one
      runGenerator(plop, generatorNames[0], config);
    } else {
      console.error(GEN.error + `No generator name given.`);
      process.exit(1);
    }
  } else if (generatorNames.includes(generatorName)) {
    // Run the selected generator
    runGenerator(plop, generatorName, config);
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
const runGenerator = (plop, name, config) => {
  // Run the generator.
  const generator = plop.getGenerator(name);
  generator.runPrompts();
};
