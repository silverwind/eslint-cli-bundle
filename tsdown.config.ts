import {nodeCli} from "tsdown-config-silverwind";
import {defineConfig} from "tsdown";

export default defineConfig(nodeCli({
  entry: {
    "eslint": "./node_modules/eslint/bin/eslint.js",
    "node_modules/eslint/lib/cli-engine/formatters/stylish": "./node_modules/eslint/lib/cli-engine/formatters/stylish.js",
    "node_modules/eslint/lib/cli-engine/formatters/html": "./node_modules/eslint/lib/cli-engine/formatters/html.js",
    "node_modules/eslint/lib/cli-engine/formatters/json": "./node_modules/eslint/lib/cli-engine/formatters/json.js",
    "node_modules/eslint/lib/cli-engine/formatters/json-with-metadata": "./node_modules/eslint/lib/cli-engine/formatters/json-with-metadata.js",
  },
  url: import.meta.url,
  minify: true,
  sourcemap: false,
  shims: true,
}));
