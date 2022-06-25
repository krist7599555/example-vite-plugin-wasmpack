import _ from "lodash";
import * as path from "node:path";
import { $ } from "zx";

/**
 * vite plugin to do wasm hot compile and reload
 */
export const wasmPack = ({
  dir = "./",
  outdir = null as null | string, // default is ./pkg
  dev = process.env.NODE_ENV !== "production",
  scope = null as null | `@${string}`,
  watch = ["src/**/*.rs"], // watch relative tto dir as glob pattern
} = {}): import("vite").Plugin => {
  dir = path.resolve(dir);

  let compile_ps: ReturnType<typeof $>;
  const compile = _.throttle(async () => {
    if (compile_ps) {
      await compile_ps.kill();
      await compile_ps.exitCode;
    }
    const compile_opt = [
      dev ? ["--dev"] : [],
      scope ? ["--scope", scope.replace(/^@/, "")] : [],
      outdir ? ["--out-dir", path.resolve(outdir)] : [],
      ["--target", "web"],
      [dir],
    ].flat();
    compile_ps = $`wasm-pack build ${compile_opt}`;
    await compile_ps;
  });
  return {
    name: "@krist7599555/vite-plugin-wasmpack",
    enforce: "pre",
    async buildStart() {
      console.log(process.env.NODE_ENV);
      await compile();
    },
    configureServer({ middlewares, watcher }) {
      for (const glob of watch) {
        watcher.add(path.join(dir, glob));
      }
      watcher.on("all", async (_, path) => {
        if (path.endsWith(".rs")) {
          console.log("change", path);
          await compile();
        }
      });
      return () => {
        middlewares.use((req, res, next) => {
          const basename = path.basename(req.url);
          if (basename.endsWith(".wasm")) {
            res.setHeader("Content-Type", "application/wasm");
          }
          return next();
        });
      };
    },
  };
};
