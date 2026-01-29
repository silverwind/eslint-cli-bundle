import {defineConfig} from "tsup";

export default defineConfig({
  entry: ["./node_modules/eslint/bin/eslint.js"],
  minify: true,
  sourcemap: false,
  shims: true,
  clean: true,
  target: "node20",
  external: ["fsevents", "jiti"],
  esbuildOptions: opts => {
    opts.legalComments = "none";
  }
});
