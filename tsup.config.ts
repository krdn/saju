import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  shims: true,
  minify: false,
  splitting: false,
  external: ["korean-lunar-calendar", "lunar-javascript", "zod"],
});
