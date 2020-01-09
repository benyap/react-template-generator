#!/usr/bin/env node

import fs from "fs";
import v8flags from "v8flags";
import chalk from "chalk";
import ora from "ora";
import minimist from "minimist";

import Liftoff from "liftoff";
import nodePlop from "node-plop";

import { getConfig, out } from "./utils";

const Generator = new Liftoff({
  name: "reactgen",
  configName: "reactgenconfig",
  extensions: {
    ".js": null
  },
  v8flags
});

Generator.launch({}, env => {
  out.info("Launching React Typescript Generator");
  const config = getConfig(env);
});
