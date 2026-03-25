import {ESLint} from "./dist/api.js"; // eslint-disable-line import-x/extensions

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: {rules: {"no-var": "error"}},
});
const results = await eslint.lintText("var x = 1;\n");

if (!results.length) {
  throw new Error("Expected lint results");
}

if (!results[0].messages.some(m => m.ruleId === "no-var")) {
  throw new Error("Expected no-var violation");
}
