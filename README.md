# sample use wasm with vite svelte

## How it work

## config of [vite.plugin.wasm-pack.ts](./vite.plugin.wasm-pack.ts)

most logic work from [vite.plugin.wasm-pack.ts](./vite.plugin.wasm-pack.ts) to watch and rebuild file if any `.rs` is change
https://github.com/krist7599555/example-vite-plugin-wasmpack/blob/b36f836b7d802595c50904b33ee36870f88395e0/vite.plugin.wasm-pack.ts#L5-L23

```typescript
// vite.plugin.wasm-pack.ts

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
} = {}): import("vite").Plugin;
```

### typescript infer type from [package.json](./package.json)

https://github.com/krist7599555/example-vite-plugin-wasmpack/blob/fe263b5494081c8296caff7c26bfe105c887a034/package.json#L23-L24

```json
  "dependencies": {
    "@krist7599555/my-webgl-lib": "link:packages/mywebgllib",
  }
```

## how to run

### dev server with hotreloadd

```bash
pnpm run dev
```

### production build

```bash
pnpm run dev
```

## folder structure

```
- client   (svelte-web)
- dist     (svelte-web output (ignore))

- src      (rust-wasm)
- target   (rust-wasm rustc output (ignore))
- packages (rust-wasm wask-pack output (ignore))
           specific at vite.config.ts

- scripts (cli)
```

## stack

- [wasm-pack](https://rustwasm.github.io/docs/wasm-pack/introduction.html)
- vite
- svelte
