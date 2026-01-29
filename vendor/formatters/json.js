/**
 * @fileoverview JSON reporter
 * @author Burak Yigit Kaya aka BYK
 * 
 * Vendored from ESLint v9.39.2
 * Original: node_modules/eslint/lib/cli-engine/formatters/json.js
 * License: MIT (https://github.com/eslint/eslint/blob/main/LICENSE)
 */
"use strict";

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function (results) {
	return JSON.stringify(results);
};
