import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/schemas/index.ts",
    "src/engine/index.ts",
    "src/content/index.ts",
    "src/persistence/index.ts",
  ],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  loader: {
    ".json": "json",
  },
});
