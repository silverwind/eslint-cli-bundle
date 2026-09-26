import {deepStrictEqual, ok} from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {ESLint} from "./dist/api.js";
import {includeIgnoreFile} from "./dist/config.js";

const [{messages}] = await new ESLint({
  overrideConfigFile: true,
  overrideConfig: {rules: {"no-var": "error"}},
}).lintText("var x = 1;\n");
deepStrictEqual(messages.map(message => message.ruleId), ["no-var"]);
ok(includeIgnoreFile(`${import.meta.dirname}/.gitignore`).ignores.includes("dist"));
execFileSync(process.execPath, ["dist/eslint.js", "--concurrency", "2", "--no-config-lookup", "src"], {stdio: "pipe"});
