const path = require("path");
const { getParts, pathTail } = require(".");

/**
 * Helper function to locate whether a particular
 * thing exists in a specific part of the project.
 * @param {string} part the name of the part
 */
const existsInPart = part => component => {
  const parts = getParts(part);
  const index = parts.map(pathTail).indexOf(component);
  if (index >= 0) {
    // Extract the name of the module
    const pathParts = parts[index].split(path.sep);
    const moduleIndex = pathParts.indexOf("modules");
    return pathParts[moduleIndex + 1];
  }
  return null;
};

/**
 * Check whether a component exists in a module in the project.
 * If it does not exist, `null` will be returned. Otherwise,
 * the name of the module will be returned.
 */
const componentExistsIn = existsInPart("components");

/**
 * Check whether a context exists in a module in the project.
 * If it does not exist, `null` will be returned. Otherwise,
 * the name of the module will be returned.
 */
const contextExistsIn = existsInPart("contexts");

/**
 * Check whether a page exists in a module in the project.
 * If it does not exist, `null` will be returned. Otherwise,
 * the name of the module will be returned.
 */
const pageExistsIn = existsInPart("pages");

module.exports = { componentExistsIn, contextExistsIn, pageExistsIn };
