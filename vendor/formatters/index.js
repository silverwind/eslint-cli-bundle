/**
 * Bundled formatters for eslint-cli-bundle
 * 
 * These formatters are vendored from ESLint v9.39.2 to avoid
 * dynamic import issues when the bundle is installed as a dependency.
 * 
 * License: MIT (https://github.com/eslint/eslint/blob/main/LICENSE)
 */

"use strict";

module.exports = {
	stylish: require("./stylish"),
	html: require("./html"),
	json: require("./json"),
	"json-with-metadata": require("./json-with-metadata"),
};
