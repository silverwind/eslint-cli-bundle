import {nodeCli} from "tsdown-config-silverwind";
import {defineConfig} from "tsdown";

export default defineConfig(nodeCli({
  entry: {
    "eslint": "./node_modules/eslint/bin/eslint.js",
    "config": "./src/config.js",
    "api": "./src/api.js",
    "worker": "./node_modules/eslint/lib/eslint/worker.js",
    "shared/translate-cli-options": "./node_modules/eslint/lib/shared/translate-cli-options.js",
  },
  url: import.meta.url,
  shims: true,
}));
