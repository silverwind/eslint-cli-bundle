import {nodeCli} from "tsdown-config-silverwind";
import {defineConfig} from "tsdown";

export default defineConfig(nodeCli({
  entry: {
    "eslint": "./node_modules/eslint/bin/eslint.js",
  },
  url: import.meta.url,
  minify: true,
  sourcemap: false,
  shims: true,
}));
