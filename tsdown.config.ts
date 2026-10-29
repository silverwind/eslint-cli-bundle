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
    plugins: [{
      name: "builtin-formatters", // eslint imports formatters from a runtime path, require them so they get bundled
      transform(code: string, id: string) {
        if (!id.endsWith("/eslint/lib/eslint/eslint.js")) return;
        const search = "formatter = (await import(pathToFileURL(formatterPath))).default;";
        if (!code.includes(search)) throw new Error(`eslint.js no longer contains "${search}"`);
        return code.replace(search, () => `formatter = (isBuiltInFormatter && {
          __proto__: null,
          stylish: require("../cli-engine/formatters/stylish"),
          html: require("../cli-engine/formatters/html"),
          json: require("../cli-engine/formatters/json"),
          "json-with-metadata": require("../cli-engine/formatters/json-with-metadata"),
        }[normalizedFormatName]) || (await import(pathToFileURL(formatterPath))).default;`);
      },
    }],
  }),
  ...["estree", "core", "plugin-kit", "config-helpers"].map(name => base({ // one build each, shared dts chunks leak rolldown's __exportAll
    entry: {[`types/${name}`]: `./src/types/${name}.ts`},
    url: import.meta.url,
    dts: {emitDtsOnly: true},
    plugins: [{
      name: "config-helpers-cjs-types", // its cjs types import a types.d.cts it doesn't ship, use the identical esm one
      load: {
        order: "pre",
        handler(id: string) {
          if (!id.endsWith("/@eslint/config-helpers/dist/cjs/types.d.cts")) return;
          return this.fs.readFile(id.replace("/cjs/types.d.cts", "/esm/types.d.ts"), {encoding: "utf8"});
        },
      },
    }],
  })),
]);
