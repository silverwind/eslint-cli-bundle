import {base, nodeCli} from "tsdown-config-silverwind";
import {defineConfig} from "tsdown";

export default defineConfig([
  nodeCli({
    entry: {
      "eslint": "./node_modules/eslint/bin/eslint.js",
      "config": "./src/config.js",
      "api": "./src/api.js",
      "worker": "./node_modules/eslint/lib/eslint/worker.js",
      "shared/translate-cli-options": "./node_modules/eslint/lib/shared/translate-cli-options.js",
    },
    url: import.meta.url,
    shims: true,
    dts: false, // Makefile ships eslint's own d.ts, bundling them breaks names shadowed inside its namespaces
  }),
  ...["estree", "core", "plugin-kit", "config-helpers"].map(name => base({ // one build each, shared dts chunks leak rolldown's __exportAll
    entry: {[`types/${name}`]: `./src/types/${name}.ts`},
    url: import.meta.url,
    dts: {generator: "tsgo", emitDtsOnly: true},
  })),
]);
