import _ from "lodash";
import * as path from "node:path";
import { $ } from "zx";

/**
 * vite plugin to do wasm hot compile and reload
 */
export function wasmPack({
  // root dir to Cargo.toml
  dir = "./",

  // node package output directory (default is ./pkg)
  outdir = null as null | string,

  // fast compile for dev
  dev = process.env.NODE_ENV !== "production",

  // node package @scope/rustpackagename
  scope = null as null | `@${string}`,

  // hmr watcher glob pattern, relative to `dir`
  watch = ["src/**/*.rs"],
} = {}): import("vite").Plugin {
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
}
