import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { wasmPack } from "./vite.plugin.wasm-pack";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    wasmPack({
      dir: "./",
      outdir: "./packages/mywebgllib",
      dev: process.env.NODE_ENV != "production",
      scope: "@krist7599555",
    }),
    svelte(),
  ],
});
