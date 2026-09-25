import {ESLint} from "./dist/api.js";

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: {rules: {"no-var": "error"}},
});
const results = await eslint.lintText("var x = 1;\n");

if (!results.length) {
  throw new Error("Expected lint results");
}

if (results[0].messages.every(m => m.ruleId !== "no-var")) {
  throw new Error("Expected no-var violation");
}
