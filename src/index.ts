#!/usr/bin/env node

import v8flags from "v8flags";
import minimist from "minimist";

import Liftoff from "liftoff";
import nodePlop from "node-plop";

import { getConfig } from "./config";
import { out } from "./out";

import load from "./commands/load";
import list from "./commands/list";
import version from "./commands/version";
import help from "./commands/help";
import generate from "./commands/generate";

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

  // Create Plop instance
  const plop = nodePlop("");

  // Load generators
  load(plop, config);

  // Parse arguments passed
  const argv = minimist(process.argv.slice(2), {
    alias: {
      v: "version",
      l: "list",
      h: "help"
    }
  });

  // Run recognised commands
  if (argv.list) {
    list(plop, config);
  } else if (argv.version) {
    version();
  } else if (argv.help) {
    help();
  } else {
    // Generate templates
    generate(plop, argv._[0]);
  }
});
