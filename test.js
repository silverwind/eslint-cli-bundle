import {execFileSync} from "node:child_process";
import {ESLint} from "./dist/api.js";

const results = await new ESLint({
  overrideConfigFile: true,
  overrideConfig: {rules: {"no-var": "error"}},
}).lintText("var x = 1;\n");

if (!results.length) {
  throw new Error("Expected lint results");
}

if (results[0].messages.every(message => message.ruleId !== "no-var")) {
  throw new Error("Expected no-var violation");
}

execFileSync(process.execPath, ["dist/eslint.js", "--concurrency", "2", "--no-config-lookup", "src"], {stdio: "pipe"});
