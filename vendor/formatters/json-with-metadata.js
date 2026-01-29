/**
 * @fileoverview JSON reporter, including rules metadata
 * @author Chris Meyer
 * 
 * Vendored from ESLint v9.39.2
 * Original: node_modules/eslint/lib/cli-engine/formatters/json-with-metadata.js
 * License: MIT (https://github.com/eslint/eslint/blob/main/LICENSE)
 */
"use strict";

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function (results, data) {
	return JSON.stringify({
		results,
		metadata: data,
	});
};
